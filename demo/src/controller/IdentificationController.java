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
	//获取列表数据
	@RequestMapping("getListData.do")
	public void getListData(String v_json,HttpServletResponse response) throws IOException{
		response.setContentType("text/html;charset=utf-8");
		PrintWriter out=response.getWriter();
		String sql="";
		if (v_json != null) {
			JSONObject json = JSONObject.fromObject(v_json);
			sql=String.format("select * from %s where 1=1", json.get("table"));
			Iterator it = json.keys();
			while (it.hasNext()) {
				String key = (String) it.next();
				Object value = json.get(key);
				if(!value.toString().equals("") && !key.equals("table")){
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
