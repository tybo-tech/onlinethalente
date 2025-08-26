// upload.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constants } from '../../../../Constants';

type UploadResponse = {
  success: boolean;
  url: string;
  stored_name?: string;
  original_name?: string;
  mime?: string;
  size?: number;
  message?: string;
};

@Injectable({ providedIn: 'root' })
export class UploadService {
  url = `${Constants.ApiBase}`;

  constructor(private http: HttpClient) {}

  uploadFile(formData: FormData): Observable<UploadResponse> {
    return this.http.post<UploadResponse>(`${this.url}/upload/upload.php`, formData);
  }

  deleteFile(fileName: string): Observable<any> {
    return this.http.get<any>(`${this.url}/upload/delete.php?file=${encodeURIComponent(fileName)}`);
  }

  /** Public API */
  onUpload = (
    files: FileList | null,
    item: any,
    key: string,
    cb: (url: string, meta?: Partial<UploadResponse>) => void
  ) => {
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const isImage = /^image\//.test(file.type);
      if (isImage && file.type !== 'image/gif' && file.size > 2_000_000) {
        // Large image → resize then upload
        this.resizeAndUploadImage(file, item, key, cb);
      } else if (isImage) {
        // Small image → upload as-is (dir=images)
        this.uploadOriginal(file, item, key, 'images', cb);
      } else {
        // Document or other → upload as-is (dir=docs)
        this.uploadOriginal(file, item, key, 'docs', cb);
      }
    });
  };

  private uploadOriginal(
    file: File,
    item: any,
    key: string,
    dir: 'images' | 'docs',
    cb: (url: string, meta?: Partial<UploadResponse>) => void
  ) {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('dir', dir); // hint for server

    this.uploadFile(formData).subscribe((res) => {
      if (res?.success) {
        const uri = `${this.url}/upload/${res.url}`;
        item[key] = uri;
        cb(uri, res);
      } else {
        alert(res?.message || 'Upload failed');
      }
    });
  }

  private resizeAndUploadImage(
    file: File,
    item: any,
    key: string,
    cb: (url: string, meta?: Partial<UploadResponse>) => void
  ) {
    const reader = new FileReader();
    reader.onload = (ev: any) => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 1200; // bigger but still reasonable
        let { width, height } = image;
        if (width > height) {
          if (width > maxSize) {
            height = Math.round(height * (maxSize / width));
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round(width * (maxSize / height));
            height = maxSize;
          }
        }
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d')?.drawImage(image, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (!blob) return alert('Failed to resize image');
            const resizedFile = new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), {
              type: 'image/jpeg',
            });
            this.uploadOriginal(resizedFile, item, key, 'images', cb);
          },
          'image/jpeg',
          0.85
        );
      };
      image.src = ev.target.result.toString();
    };
    reader.readAsDataURL(file);
  }
}
