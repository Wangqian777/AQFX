package utils;

import java.io.File;

import org.springframework.web.multipart.MultipartFile;

public class FileUtil {
	public static File Upload(MultipartFile file, String targetSrc, String fileName) throws Exception {
		// 判断文件夹是否存在
		File targetDir = new File(targetSrc);
		if (!targetDir.exists()) {
			// 创建文件夹
			targetDir.mkdirs();
		}
		File targetFile = new File(targetSrc, fileName);
		// 如果文件已经存在，则删除原有文件
		if (targetFile.exists()) {
			targetFile.delete();
		}
		file.transferTo(targetFile);

		return targetFile;
	}

	public static File GetFile(String FileName, String src) throws Exception {
		File target = new File(src, FileName);
		if (target.exists()) {
			return target;
		} else {
			return null;
		}
	}
}
