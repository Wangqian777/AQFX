package controller;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Random;

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
	
	@RequestMapping("uploadFile.do")
	public void uploadFile(HttpServletRequest request, HttpServletResponse response,@RequestParam("file") MultipartFile file) throws IOException {
		PrintWriter out = response.getWriter();
		String path="";
		try {
			if(file==null || file.isEmpty()) {
				return;
			}
            String targetSrc = request.getServletContext().getRealPath("/file");
            String fileName =file.getOriginalFilename();
            fileName=fileName.substring(fileName.lastIndexOf("."),fileName.length());
            fileName=getRandomFileName()+fileName;
            File targetFile = FileUtil.Upload(file, targetSrc, fileName);
            
			path += targetFile.getPath();
			out.print(JsonResult.Success(path, "").toJson());
			out.flush();
			out.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	@RequestMapping("deleteFile.do")
	public void deleteFile(String path,HttpServletResponse response) throws IOException {
		PrintWriter out = response.getWriter();
		File file=new File(path);
		int flag=0;
		if(file.delete()){
			flag=1;
		}
		out.print(flag);
		out.flush();
		out.close();
	}
	@RequestMapping("download.do")
	public void download(String path,String fileName, HttpServletResponse response) {  
        try {  
            // path是指欲下载的文件的路径。  
            File file = new File(path);  
            // 以流的形式下载文件。  
            InputStream fis = new BufferedInputStream(new FileInputStream(path));  
            byte[] buffer = new byte[fis.available()];  
            fis.read(buffer);  
            fis.close();  
            // 清空response  
            response.reset();  
            // 设置response的Header  
            response.addHeader("Content-Disposition", "attachment;filename="  
                    + new String(fileName.getBytes(),"iso-8859-1"));  
            response.addHeader("Content-Length", "" + file.length());  
            OutputStream toClient = new BufferedOutputStream(response.getOutputStream());
            response.setContentType("application/vnd.ms-excel;charset=UTF-8");  
            toClient.write(buffer);  
            toClient.flush();  
            toClient.close();  
        } catch (IOException ex) {  
            ex.printStackTrace();  
        }
    }
	private static String getRandomFileName() {  
		SimpleDateFormat simpleDateFormat;  
        simpleDateFormat = new SimpleDateFormat("yyyyMMdd");  
        Date date=new Date();
        String str = simpleDateFormat.format(date);  
        Random random = new Random();  
        int rannum = (int) (random.nextDouble() * (99999 - 10000 + 1)) + 10000;// 获取5位随机数  
        return rannum + str;// 当前时间  
    } 
}
