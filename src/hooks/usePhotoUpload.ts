import { useState } from 'react';
import { supabase, isSupabaseActive, appConfig } from '../lib/config';

interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

interface UploadProgress {
  isUploading: boolean;
  progress: number;
}

export const usePhotoUpload = () => {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    isUploading: false,
    progress: 0
  });

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // Verificar tipo de arquivo
    if (!appConfig.storage.allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Tipo de arquivo não permitido. Use apenas JPG, PNG ou WebP.'
      };
    }

    // Verificar tamanho
    if (file.size > appConfig.storage.maxFileSize) {
      return {
        valid: false,
        error: `Arquivo muito grande. Máximo permitido: ${appConfig.storage.maxFileSize / (1024 * 1024)}MB`
      };
    }

    return { valid: true };
  };

  const uploadPhoto = async (
    file: File,
    materialType: string,
    userId: string
  ): Promise<UploadResult> => {
    // Validar arquivo
    const validation = validateFile(file);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    setUploadProgress({ isUploading: true, progress: 0 });

    try {
      if (isSupabaseActive() && supabase) {
        // Upload real via Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}/${Date.now()}_${materialType.toLowerCase().replace(/\s+/g, '_')}.${fileExt}`;

        // Simular progresso (Supabase não fornece progresso real ainda)
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => ({
            ...prev,
            progress: Math.min(prev.progress + 10, 90)
          }));
        }, 200);

        const { data, error } = await supabase.storage
          .from(appConfig.storage.bucket)
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        clearInterval(progressInterval);

        if (error) {
          setUploadProgress({ isUploading: false, progress: 0 });
          return { success: false, error: error.message };
        }

        // Obter URL pública
        const { data: { publicUrl } } = supabase.storage
          .from(appConfig.storage.bucket)
          .getPublicUrl(fileName);

        setUploadProgress({ isUploading: false, progress: 100 });

        return {
          success: true,
          url: publicUrl
        };

      } else {
        // Upload demo (simular com delay)
        return new Promise((resolve) => {
          let progress = 0;
          const progressInterval = setInterval(() => {
            progress += 15;
            setUploadProgress({ isUploading: true, progress });

            if (progress >= 100) {
              clearInterval(progressInterval);
              setUploadProgress({ isUploading: false, progress: 100 });
              
              // URL demo (usando um placeholder)
              const demoUrl = `https://picsum.photos/400/300?random=${Date.now()}`;
              
              resolve({
                success: true,
                url: demoUrl
              });
            }
          }, 300);
        });
      }
    } catch (error) {
      setUploadProgress({ isUploading: false, progress: 0 });
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido no upload'
      };
    }
  };

  const uploadMultiplePhotos = async (
    files: File[],
    materialType: string,
    userId: string
  ): Promise<{ results: UploadResult[]; allSuccess: boolean }> => {
    const results: UploadResult[] = [];
    let allSuccess = true;

    for (let i = 0; i < files.length; i++) {
      const result = await uploadPhoto(files[i], materialType, userId);
      results.push(result);
      
      if (!result.success) {
        allSuccess = false;
      }

      // Pequeno delay entre uploads
      if (i < files.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    return { results, allSuccess };
  };

  const deletePhoto = async (photoUrl: string): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseActive() && supabase) {
      try {
        // Extrair caminho do arquivo da URL
        const urlParts = photoUrl.split('/');
        const fileName = urlParts.slice(-2).join('/'); // userId/filename

        const { error } = await supabase.storage
          .from(appConfig.storage.bucket)
          .remove([fileName]);

        if (error) {
          return { success: false, error: error.message };
        }

        return { success: true };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Erro ao deletar foto'
        };
      }
    } else {
      // Delete demo (sempre sucesso)
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true });
        }, 1000);
      });
    }
  };

  const getPhotosByUser = async (userId: string): Promise<string[]> => {
    if (isSupabaseActive() && supabase) {
      try {
        const { data, error } = await supabase.storage
          .from(appConfig.storage.bucket)
          .list(userId);

        if (error) {
          console.error('Erro ao buscar fotos:', error);
          return [];
        }

        // Gerar URLs públicas
        const urls = data?.map(file => {
          const { data: { publicUrl } } = supabase!
            .storage
            .from(appConfig.storage.bucket)
            .getPublicUrl(`${userId}/${file.name}`);
          return publicUrl;
        }) || [];

        return urls;
      } catch (error) {
        console.error('Erro ao buscar fotos:', error);
        return [];
      }
    } else {
      // Fotos demo
      return [
        'https://picsum.photos/400/300?random=1',
        'https://picsum.photos/400/300?random=2',
        'https://picsum.photos/400/300?random=3'
      ];
    }
  };

  return {
    uploadPhoto,
    uploadMultiplePhotos,
    deletePhoto,
    getPhotosByUser,
    uploadProgress,
    validateFile,
    isDemo: !isSupabaseActive()
  };
};