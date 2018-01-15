package controller;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import utils.FileUtil;
import utils.JsonResult;

@Controller
public class FileController {
	
	@RequestMapping("upload.do")
	public void upload(HttpServletRequest request, HttpServletResponse response,@RequestParam("file") MultipartFile file) throws IOException {
		PrintWriter out = response.getWriter();
		String path="";
		try {
			if(file==null || file.isEmpty()) {
				return;
			}
            String targetSrc = request.getServletContext().getRealPath("/file");
            String fileName =file.getOriginalFilename();
            File targetFile = FileUtil.Upload(file, targetSrc, fileName);
            
			path += targetFile.getPath();
			out.print(JsonResult.Success(path, "").toJson());
			out.flush();
			out.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	@RequestMapping("test.do")
	public void test() {
		System.out.println("ok");
	}
}
