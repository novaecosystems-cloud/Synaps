import { createClient } from '@supabase/supabase-js';

// firebase-admin import removed to fix TS error
const gcsBucket: any = { file: () => ({ getSignedUrl: () => [], delete: () => {} }) };

// Initialize Supabase (only works if keys are present)
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// The Supabase storage bucket name to use
const SUPABASE_BUCKET_NAME = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'documents';

// Check which provider is configured
const getProvider = (): 'SUPABASE' | 'FIREBASE' => {
  if (process.env.STORAGE_PROVIDER === 'SUPABASE') return 'SUPABASE';
  if (process.env.STORAGE_PROVIDER === 'FIREBASE') {
    throw new Error(
      'Firebase/GCS storage is not wired (stub bucket). Set STORAGE_PROVIDER=SUPABASE or implement gcsBucket in storage.ts.'
    );
  }
  // Default to Supabase when available; otherwise fail with a clear config error
  if (supabase) return 'SUPABASE';
  throw new Error(
    'No storage provider configured. Set STORAGE_PROVIDER=SUPABASE with SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.'
  );
}

export async function generateUploadUrl(
  filePath: string,
  contentType: string,
  sizeBytes: number
): Promise<{ url: string; path: string }> {
  const provider = getProvider();

  if (provider === 'SUPABASE') {
    if (!supabase) throw new Error('Supabase is not configured (missing URL or Key)');
    
    // Supabase Signed Upload URL (expires in 15 minutes)
    const { data, error } = await supabase
      .storage
      .from(SUPABASE_BUCKET_NAME)
      .createSignedUploadUrl(filePath);

    if (error) throw new Error(`Supabase error: ${error.message}`);
    
    // The returned URL from Supabase requires a PUT request with the binary payload
    return { url: data.signedUrl, path: data.path };
  } 
  
  else {
    // FIREBASE / Google Cloud Storage
    const file = gcsBucket.file(filePath);
    const [url] = await file.getSignedUrl({
      version: 'v4',
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      contentType: contentType,
      extensionHeaders: {
        'x-goog-content-length-range': `0,${sizeBytes}`,
      },
    });

    return { url, path: filePath };
  }
}

export async function generateDownloadUrl(filePath: string): Promise<string> {
  const provider = getProvider();

  if (provider === 'SUPABASE') {
    if (!supabase) throw new Error('Supabase is not configured');
    
    // Supabase Signed Download URL (expires in 1 hour)
    const { data, error } = await supabase
      .storage
      .from(SUPABASE_BUCKET_NAME)
      .createSignedUrl(filePath, 60 * 60);

    if (error) throw new Error(`Supabase error: ${error.message}`);
    return data.signedUrl;
  }
  
  else {
    // FIREBASE / Google Cloud Storage
    const file = gcsBucket.file(filePath);
    const [url] = await file.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + 60 * 60 * 1000, // 1 hour
    });
    return url;
  }
}

export async function deleteFile(filePath: string): Promise<void> {
  const provider = getProvider();

  if (provider === 'SUPABASE') {
    if (!supabase) throw new Error('Supabase is not configured');
    
    const { error } = await supabase
      .storage
      .from(SUPABASE_BUCKET_NAME)
      .remove([filePath]);

    if (error) throw new Error(`Supabase error: ${error.message}`);
  }
  
  else {
    // FIREBASE / Google Cloud Storage
    const file = gcsBucket.file(filePath);
    await file.delete({ ignoreNotFound: true });
  }
}
