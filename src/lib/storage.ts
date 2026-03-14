import { supabase } from './supabase'

const BUCKET = 'images'

/** Upload an image file to Supabase Storage. Returns the public URL. */
export async function uploadImage(
  file: File,
  path: string
): Promise<string> {
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: true })

  if (error) throw error

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

/** Delete an image from Supabase Storage. */
export async function deleteImage(path: string): Promise<void> {
  const { error } = await supabase.storage.from(BUCKET).remove([path])
  if (error) throw error
}

/** List images in a folder. */
export async function listImages(folder: string) {
  const { data, error } = await supabase.storage.from(BUCKET).list(folder)
  if (error) throw error
  return data
}
