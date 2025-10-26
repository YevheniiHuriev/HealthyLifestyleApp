using Minio;
using Minio.Exceptions;
using Minio.DataModel.Args;
using Microsoft.Extensions.Options;
using HealthyLifestyle.Application.Interfaces.ObjectStorage;
using System.Threading;
using Minio.ApiEndpoints;

namespace HealthyLifestyle.Application.Services.ObjectStorage;

public class MinioService : IObjectStorageService
{
    private readonly IMinioClient _minioClient;
    private readonly IMinioClient _publicClient;
    private readonly MinioSettings _settings;

    public MinioService(IOptions<MinioSettings> settings)
    {
        _settings = settings.Value;

        _minioClient = new MinioClient()
            .WithEndpoint(_settings.Endpoint)
            .WithCredentials(_settings.AccessKey, _settings.SecretKey)
            .Build();

        _publicClient = new MinioClient()
            .WithEndpoint(_settings.PublicEndpoint)
            .WithCredentials(_settings.AccessKey, _settings.SecretKey)
            .Build();
    }

    public async Task<string> UploadFileAsync(Stream stream, string objectName, string contentType)
    {
        try
        {
            var foundArgs = new BucketExistsArgs().WithBucket(_settings.BucketName);
            bool found = await _minioClient.BucketExistsAsync(foundArgs).ConfigureAwait(false);
            if (!found)
            {
                var mkBucketArgs = new MakeBucketArgs().WithBucket(_settings.BucketName);
                await _minioClient.MakeBucketAsync(mkBucketArgs).ConfigureAwait(false);
                Console.WriteLine($"Бакет '{_settings.BucketName}' успешно создан.");
            }

            var putObjectArgs = new PutObjectArgs()
                .WithBucket(_settings.BucketName)
                .WithObject(objectName)
                .WithStreamData(stream)
                .WithObjectSize(stream.Length)
                .WithContentType(contentType);

            await _minioClient.PutObjectAsync(putObjectArgs).ConfigureAwait(false);
            Console.WriteLine($"Файл '{objectName}' успешно загружен.");

            return $"{_settings.PublicEndpoint}/{_settings.BucketName}/{objectName}";
        }
        catch (MinioException e)
        {
            Console.WriteLine($"Ошибка MinIO: {e.Message}");
            throw;
        }
        catch (Exception e)
        {
            Console.WriteLine($"Общая ошибка: {e.Message}");
            throw;
        }
    }

    public async Task DeleteFileAsync(string objectName)
    {
        try
        {
            var removeObjectArgs = new RemoveObjectArgs()
                .WithBucket(_settings.BucketName)
                .WithObject(objectName);

            await _minioClient.RemoveObjectAsync(removeObjectArgs).ConfigureAwait(false);
            Console.WriteLine($"Файл '{objectName}' успішно видалено.");
        }
        catch (Exception e)
        {
            Console.WriteLine($"Помилка видалення об'єкта {objectName}: {e.Message}");
            throw;
        }
    }

    public async Task DeleteFileByObjectNameAsync(string objectName)
    {
        try
        {
            var removeObjectArgs = new RemoveObjectArgs()
                .WithBucket(_settings.BucketName)
                .WithObject(objectName);

            await _minioClient.RemoveObjectAsync(removeObjectArgs).ConfigureAwait(false);
            Console.WriteLine($"Файл '{objectName}' успішно видалено через DeleteFileByObjectNameAsync.");
        }
        catch (Exception e)
        {
            Console.WriteLine($"Помилка видалення об'єкта {objectName} через DeleteFileByObjectNameAsync: {e.Message}");
            throw;
        }
    }

    public async Task<Stream> GetFileAsync(string objectName, CancellationToken cancellationToken = default)
    {
        MemoryStream memoryStream = null;
        try
        {
            Console.WriteLine($"🖼️ [MINIO] Початок завантаження файлу: {objectName}");
            memoryStream = new MemoryStream();

            // Check if already cancelled
            cancellationToken.ThrowIfCancellationRequested();

            var getObjectArgs = new GetObjectArgs()
                .WithBucket(_settings.BucketName)
                .WithObject(objectName)
                .WithCallbackStream((stream) =>
                {
                    try
                    {
                        // Check cancellation before copying
                        if (cancellationToken.IsCancellationRequested)
                        {
                            Console.WriteLine($"🖼️ [MINIO] Запит скасовано для файлу: {objectName}");
                            return;
                        }

                        Console.WriteLine($"🖼️ [MINIO] Початок копіювання потоку для файлу: {objectName}");

                        // Copy with buffer and check cancellation periodically
                        byte[] buffer = new byte[81920]; // 80KB buffer
                        int bytesRead;
                        while ((bytesRead = stream.Read(buffer, 0, buffer.Length)) > 0)
                        {
                            if (cancellationToken.IsCancellationRequested)
                            {
                                Console.WriteLine($"🖼️ [MINIO] Копіювання скасовано для файлу: {objectName}");
                                return;
                            }
                            memoryStream.Write(buffer, 0, bytesRead);
                        }

                        Console.WriteLine($"🖼️ [MINIO] Завершено копіювання потоку для файлу: {objectName}");
                    }
                    catch (Exception ex) when (ex is OperationCanceledException || cancellationToken.IsCancellationRequested)
                    {
                        Console.WriteLine($"🖼️ [MINIO] Операція скасована для файлу {objectName}");
                        throw;
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"🖼️ [MINIO] Помилка в callback для файлу {objectName}: {ex.Message}");
                        throw;
                    }
                });

            Console.WriteLine($"🖼️ [MINIO] Викликаємо GetObjectAsync для файлу: {objectName}");
            await _minioClient.GetObjectAsync(getObjectArgs, cancellationToken).ConfigureAwait(false);

            if (cancellationToken.IsCancellationRequested || memoryStream.Length == 0)
            {
                memoryStream?.Dispose();
                throw new OperationCanceledException("Operation was cancelled");
            }

            memoryStream.Position = 0;
            Console.WriteLine($"🖼️ [MINIO] Файл успішно завантажено: {objectName}, розмір: {memoryStream.Length} байт");
            return memoryStream;
        }
        catch (OperationCanceledException)
        {
            memoryStream?.Dispose();
            Console.WriteLine($"🖼️ [MINIO] Завантаження скасовано для файлу: {objectName}");
            throw;
        }
        catch (MinioException e)
        {
            memoryStream?.Dispose();
            Console.WriteLine($"🖼️ [MINIO] Помилка MinIO для файлу {objectName}: {e.Message}");
            throw new FileNotFoundException($"Файл '{objectName}' не знайдено в MinIO", e);
        }
        catch (Exception e)
        {
            memoryStream?.Dispose();
            Console.WriteLine($"🖼️ [MINIO] Загальна помилка для файлу {objectName}: {e.Message}");
            throw;
        }
    }

    public async Task<string> GetPresignedUrlAsync(string objectName, int expiryInSeconds)
    {
        try
        {
            var args = new PresignedGetObjectArgs()
                .WithBucket(_settings.BucketName)
                .WithObject(objectName)
                .WithExpiry(expiryInSeconds);

            return await _publicClient.PresignedGetObjectAsync(args).ConfigureAwait(false);
        }
        catch (Exception e)
        {
            Console.WriteLine($"Помилка генерації pre-signed URL: {e.Message}");
            throw;
        }
    }

    public async Task<bool> FileExistsAsync(string objectName)
    {
        try
        {
            var statObjectArgs = new StatObjectArgs()
                .WithBucket(_settings.BucketName)
                .WithObject(objectName);

            await _minioClient.StatObjectAsync(statObjectArgs).ConfigureAwait(false);
            return true;
        }
        catch (MinioException)
        {
            return false;
        }
        catch (Exception)
        {
            return false;
        }
    }

    public async Task<List<string>> ListFilesAsync(string prefix = "")
    {
        var list = new List<string>();
        var args = new ListObjectsArgs()
            .WithBucket(_settings.BucketName)
            .WithPrefix(prefix)
            .WithRecursive(true);

        var observable = _minioClient.ListObjectsAsync(args);

        var tcs = new TaskCompletionSource<List<string>>();

        IDisposable subscription = observable.Subscribe(
            item => { if (!item.IsDir) list.Add(item.Key); },
            ex => tcs.SetException(ex),
            () => tcs.SetResult(list)
        );

        try
        {
            return await tcs.Task;
        }
        finally
        {
            subscription.Dispose();
        }
    }
}