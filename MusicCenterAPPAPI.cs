namespace MusicCenterAPPWEB
{
    public class MusicCenterAPPAPI
    {
        public static string ToBase64(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return null;
            using (var memoryStream = new MemoryStream())
            {
                file.CopyTo(memoryStream);
                var fileBytes = memoryStream.ToArray();
                return Convert.ToBase64String(fileBytes);
            }
        }
    }
}
