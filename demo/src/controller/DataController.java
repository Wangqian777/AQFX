package controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import service.DataService;
import until.GenerateSql;
import until.ResultJson;

@Controller
public class DataController {
	@Autowired
	private DataService dataService;
	private String json = "";
	private GenerateSql generateSql = new GenerateSql();

	// 获取树结构json
	@RequestMapping("getTreeJson.do")
	public void getTreeJson(HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		response.setContentType("text/html;charset=utf-8");
		PrintWriter out = response.getWriter();
		String sql = "select * from 菜单";
		List<LinkedHashMap<String, Object>> mapList = new ArrayList<LinkedHashMap<String, Object>>();
		mapList = dataService.getData(sql);
		List<String> pidList = new ArrayList<String>();
		json = "[";
		for (LinkedHashMap<String, Object> linkedHashMap : mapList) {
			if ("".equals(linkedHashMap.get("PID")) || linkedHashMap.get("PID") == null) {
				pidList.add(linkedHashMap.get("ID").toString());
				JSONArray js = JSONArray.fromObject(linkedHashMap);
				json += "{"+ js.toString().substring(2, js.toString().length() - 2);
				searchSubNotActiveMenu((String) linkedHashMap.get("ID"));
				json += "},";
			}

		}
		json = json.substring(0, json.length() - 1) + "]";
		json = json.replace("null", "\"\"");
		json = json.replace("名称", "text");
		out.println(json);
		out.flush();
		out.close();
	}
	
	// 冒泡
	public void searchSubNotActiveMenu(String parentId) {
		String sql = "select * from 菜单 where pid='" + parentId + "'";
		List<LinkedHashMap<String, Object>> mapList = new ArrayList<LinkedHashMap<String, Object>>();
		mapList = dataService.getData(sql);
		if (mapList != null && mapList.size() > 0) {
			json += ",\"nodes\":[";
			for (LinkedHashMap<String, Object> linkedHashMap : mapList) {
				JSONArray js = JSONArray.fromObject(linkedHashMap);
				json += "{"+ js.toString().substring(2, js.toString().length() - 2);
				searchSubNotActiveMenu((String) linkedHashMap.get("ID"));
				json += "},";
			}
			json = json.substring(0, json.length() - 1);
			json += "]";
		}
	}

	// 菜单增删改事件
	@RequestMapping("menuManage.do")
	public void menuManage(String v_json, String action,
			HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		response.setContentType("text/html;charset=utf-8");
		PrintWriter out = response.getWriter();
		ResultJson __ret = new ResultJson();
		List<String> sql=new ArrayList<String>();
		try{
			if (action.equals("M")) {
				Map<String,List> sqlMap=generateSql.menuUpdateSql(v_json);
				sql=sqlMap.get("updateSql");
				for(String s:sql){
					dataService.updateData(s);
				}
				sql=sqlMap.get("deleteSql");
				for(String s:sql){
					dataService.deleteData(s);
				}
				sql=sqlMap.get("insertSql");
				for(String s:sql){
					s=s.replace("'null'","null");
					dataService.insertData(s);
				}
			}else if(action.equals("C")){
				Map<String,List> sqlMap=generateSql.generateInsertSql(v_json);
				sql=sqlMap.get("zhuInsertSql");
				for(String s:sql){
					dataService.insertData(s);
				}
			}else if(action.equals("D")){
				Map<String,List> sqlMap=generateSql.generateDeleteSql(v_json);
				sql=sqlMap.get("zhuDeleteSql");
				for(String s:sql){
					dataService.deleteData(s);
				}
				sql=sqlMap.get("ziDeleteSql");
				for(String s:sql){
					dataService.deleteData(s);
				}
			}
			__ret.setState("1");
		}catch (Exception e) {
			__ret.setState("0");
		}
		
		String resultJson = __ret.GenerateResultJson();
		out.println(resultJson);
		out.flush();
		out.close();
	}

	@RequestMapping("getDataCounts.do")
	public void getDataCounts(String id, String table,
			HttpServletResponse response) throws IOException {
		response.setContentType("terxt/html;charset=utf-8");
		PrintWriter out = response.getWriter();
		ResultJson __ret = new ResultJson();
		String sql = String.format("select count(1) from %s where pid='%s'",
				table, id);
		int counts = dataService.getDataCounts(sql);
		if (counts > 0) {
			__ret.setState("0");
		} else {
			__ret.setState("1");
		}
		String resultJson = __ret.GenerateResultJson();
		out.print(resultJson);
		out.flush();
		out.close();
	}
	// 获取数据库表
	@RequestMapping("getDBtable.do")
	public void getDBtable(HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		response.setContentType("text/html;charset=utf-8");
		PrintWriter out = response.getWriter();
		String sql = "select name from sysobjects where xtype = 'U'";
		List<LinkedHashMap<String, Object>> mapList = new ArrayList<LinkedHashMap<String, Object>>();
		mapList = dataService.getData(sql);
		JSONArray js = JSONArray.fromObject(mapList);
		out.print(js);
		out.flush();
		out.close();
	}

	@RequestMapping("getDBTable_mx.do")
	public void getDBTable_mx(String tableName,HttpServletRequest request, HttpServletResponse response) throws IOException{
		if(tableName!=null)
			tableName=new String(tableName.getBytes("ISO8859-1"),"UTF-8");
		response.setContentType("text/html;charset=utf-8");
		PrintWriter out = response.getWriter();
		String sql="SELECT  * \n"+
" FROM INFORMATION_SCHEMA.COLUMNS \n"+
" WHERE TABLE_NAME = '"+tableName+"' \n"+
" ORDER BY ORDINAL_POSITION";
		List<LinkedHashMap<String, Object>> mapList = new ArrayList<LinkedHashMap<String, Object>>();
		mapList = dataService.getData(sql);
		JSONArray js = JSONArray.fromObject(mapList);
		out.print(js);
		out.close();
		out.flush();
		
	}
	@RequestMapping("getDBTableColumnsBySql.do")
	public void getDBTableColumnsBySql(String ywSql,String menuId,HttpServletRequest request, HttpServletResponse response) throws IOException{
 		if(ywSql!=null)
			ywSql=new String(ywSql.getBytes("ISO8859-1"),"UTF-8");
		response.setContentType("text/html;charset=utf-8");
		PrintWriter out = response.getWriter();
		String sql="";
		sql=String.format("select count(1) from 菜单模型 where FID='%s'", menuId);
		int counts=dataService.getDataCounts(sql);
		if(counts>0){
			sql=String.format("select 名称 ,是否显示  from 菜单模型 where FID='%s'", menuId);
		}else{
			sql=String.format("select t.* into temp from (%s)t",ywSql );
			dataService.getData(sql);
			sql="SELECT COLUMN_NAME as 名称 \n"+
	" FROM INFORMATION_SCHEMA.COLUMNS \n"+
	" WHERE TABLE_NAME = 'temp' \n"+
	" ORDER BY ORDINAL_POSITION";
			
		}
		List<LinkedHashMap<String, Object>> mapList = new ArrayList<LinkedHashMap<String, Object>>();
		mapList = dataService.getData(sql);
		if(counts<1){
			dataService.dropTable("temp");
		}
		JSONArray js = JSONArray.fromObject(mapList);
		out.print(js);
		out.close();
		out.flush();	
		
	}
	@RequestMapping("getColumnList.do")
	public void getColumnList(String sql,HttpServletRequest request, HttpServletResponse response) throws IOException{
		response.setContentType("text/html;charset=utf-8");
		PrintWriter out = response.getWriter();
		if(sql!=null)
			sql=new String(sql.getBytes("ISO8859-1"),"UTF-8");
		List<LinkedHashMap<String, Object>> mapList = new ArrayList<LinkedHashMap<String, Object>>();
		mapList = dataService.getData(sql);
		JSONArray js = JSONArray.fromObject(mapList);
		out.print(js);
		out.flush();
		out.close();
	}
	//获取菜单模型列
	@RequestMapping("getMenuColumn.do")
	public void getMenuColumn(String menuId,HttpServletRequest request, HttpServletResponse response) throws IOException{
		response.setContentType("text/html;charset=utf-8");
		PrintWriter out=response.getWriter();
		String sql=String.format("select * from 菜单模型 where FID='%s' and 是否显示=1", menuId);
		List<LinkedHashMap<String, Object>> mapList = new ArrayList<LinkedHashMap<String, Object>>();
		mapList = dataService.getData(sql);
		JSONObject json = new JSONObject();
		JSONArray js = JSONArray.fromObject(mapList);
		json.put("dtlist", js);
		sql=String.format("select 列表sql from 菜单 where ID='%s'", menuId);
		mapList=dataService.getData(sql);
		js = JSONArray.fromObject(mapList);
		json.put("listSql",js);
		out.print(json);
		out.flush();
		out.close();
	}
	//根据sql获取列表数据
	@RequestMapping("getListData.do")
	public void getListData(String listSql,HttpServletRequest request,HttpServletResponse respone) throws IOException{
		respone.setContentType("text/html;charset=utf-8");
		PrintWriter out=respone.getWriter();
		if(listSql!=null)
			listSql=new String(listSql.getBytes("ISO8859-1"),"UTF-8");
		List<LinkedHashMap<String, Object>> mapList = new ArrayList<LinkedHashMap<String, Object>>();
		mapList = dataService.getData(listSql);
		JSONArray js = JSONArray.fromObject(mapList);
		JSONObject json = new JSONObject();
		json.put("dtList",js);
		json.put("total", 0);
		json.put("state","1");
		out.print(json);
		out.flush();
		out.close();
	}
	
	public void setDataService(DataService dataService) {
		this.dataService = dataService;
	}
}
