package controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import service.DataService;
import utils.GenerateSql;

@Controller
public class IdentificationController {
	@Autowired
	private DataService dataService;
	private String json = "";
	private GenerateSql generateSql = new GenerateSql();
	private List<LinkedHashMap<String, Object>> mapList = new ArrayList<LinkedHashMap<String, Object>>();
	//获取辨识单据列表
	@RequestMapping("getIdentificationList.do")
	public void getIdentificationList(String v_json,HttpServletResponse response) throws IOException{
		response.setContentType("text/html;charset=utf-8");
		PrintWriter out=response.getWriter();
		if(v_json!=null)
			v_json=new String(v_json.getBytes("ISO8859-1"),"UTF-8");
		String sql="select * from 辨识评估 where 1=1 ";
		if (v_json != null) {
			JSONObject json = JSONObject.fromObject(v_json);
			Iterator it = json.keys();
			while (it.hasNext()) {
				String key = (String) it.next();
				Object value = json.get(key);
				if(!value.toString().equals("")){
					sql += String.format(" and %s='%s'", key, value.toString());
				}
				
			}
		}
		mapList = dataService.getData(sql);
		JSONArray js = JSONArray.fromObject(mapList);
		out.print(js);
		out.flush();
		out.close();
	}
	
	
	
	
	public void setDataService(DataService dataService) {
		this.dataService = dataService;
	}
}
