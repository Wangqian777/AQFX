package utils;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.UUID;

//import com.sun.script.javascript.JSAdapter;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class GenerateSql {
	private SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"); 
	public Map<String,List> generateInsertSql(String v_json){
		List<Map> listMap=new ArrayList<Map>();
		Map<String,List> sqlMap=new HashMap<String, List>();
		List<String> tempList=new ArrayList<String>();
		listMap=currencyJson(v_json);
		String zhuSql="";
		String ziSql="";
		String FID="";
		zhuSql=String.format("Insert into %s(", listMap.get(0).get("table"));
		Map<String,String> map=listMap.get(0);
		//主表
		for(String key:map.keySet()){
			if(!key.equals("id") && !key.equals("table")){
				zhuSql+=String.format("%s,",key);
			}
		}
		zhuSql+="id,创建时间) values(";
		for(String key:map.keySet()){
			if(!key.equals("id") && !key.equals("table")){
				zhuSql+=String.format("'%s',",map.get(key));
			}
		}
		UUID uuid=UUID.randomUUID();
		FID=uuid.toString();
		zhuSql+=String.format("'%s','%s')", uuid,df.format(new Date()));
		tempList.add(zhuSql);
		sqlMap.put("zhuSql", tempList);
		try{
			Map<String,List> map2=listMap.get(1);
			if(map2.size()>0){
				List<Map> list=map2.get("dtables");
				tempList=new ArrayList<String>();
				for(Map<String,String> m:list){
					ziSql+=String.format("Insert into %s( ", m.get("table"));
					
					for(String key:m.keySet()){
						if(!key.equals("id") && !key.equals("table")){
							ziSql+=String.format("%s,",key);
						}
					}
					ziSql+="id,fid) values(";
					for(String key:m.keySet()){
						if(!key.equals("id") && !key.equals("table")){
							ziSql+=String.format("'%s','%s'",m.get(key),FID);
						}
					}
					uuid=UUID.randomUUID();
					ziSql+=String.format("'%s')\n", uuid);
					tempList.add(ziSql);
					ziSql="";
				}
				sqlMap.put("ziSql", tempList);
			}
			return sqlMap;
		}catch (Exception e) {
			return sqlMap;
		}
	}
	public Map<String,List> generateUpdateSql(String v_json){
		List<Map> listMap=new ArrayList<Map>();
		Map<String,List> sqlMap=new HashMap<String, List>();
		List<String> tempList=new ArrayList<String>();
		listMap=currencyJson(v_json);
		String zhuSql="";
		String ziSql="";
		zhuSql=String.format("update %s set ", listMap.get(0).get("table"));
		Map<String,String> map=listMap.get(0);
		//主表
		for(String key:map.keySet()){
			if(!key.equals("id") && !key.equals("table")){
				zhuSql+=String.format("%s='%s',",key,map.get(key));
			}
		}
		zhuSql+=String.format("最后修改时间='%s'", df.format(new Date()));
		if(zhuSql.substring(zhuSql.length()-1).equals(",")){
			zhuSql=zhuSql.substring(0,zhuSql.length()-1);
		}
		zhuSql+=String.format(" where id='%s'", map.get("id"));
		tempList.add(zhuSql);
		zhuSql="";
		sqlMap.put("zhuSql", tempList);
		try{
			Map<String,List> map2=listMap.get(1);
			if(map2.size()>0){
				List<Map> list=map2.get("dtables");
				tempList=new ArrayList<String>();
				for(Map<String,String> m:list){
					ziSql+=String.format("update %s set ", m.get("table"));
					for(String key:m.keySet()){
						if(!key.equals("id") && !key.equals("table")){
							ziSql+=String.format("%s='%s',",key,m.get(key));
						}
						ziSql+=String.format(" where id='%s')\n",m.get("id"));
					}
					tempList.add(ziSql);
					ziSql="";
				}
				sqlMap.put("ziSql", tempList);
			}
			return sqlMap;
		}catch (Exception e) {
			return sqlMap;
		}
	}
	public Map<String,List> generateDeleteSql(String v_json){
		List<Map> listMap=new ArrayList<Map>();
		Map<String,List> sqlMap=new HashMap<String, List>();
		List<String> tempList=new ArrayList<String>();
		String zhuSql="";
		String ziSql="";
		JSONObject json=JSONObject.fromObject(v_json);
		Iterator it = json.keys();
		String FID="";
		while(it.hasNext()){  
			String key = (String) it.next();
    		
    		if(key.equalsIgnoreCase("zhubiao")){
    			zhuSql+=String.format("delete from %s",json.get(key));
    		}
    		if(key.equalsIgnoreCase("zhubiaoID")){
    			zhuSql+=String.format(" where ID='%s'",json.get(key));
    			tempList.add(zhuSql);
    			sqlMap.put("zhuSql", tempList);
    		}
    		if(key.equalsIgnoreCase("zibiao")){
    			ziSql=String.format("delete from %s where FID='%S'", json.get(key),FID);
    			tempList.add(ziSql);
    			sqlMap.put("ziSql", tempList);
    		}
		}
		return sqlMap;
		
	}
	private List<Map> currencyJson(String v_json){
		List<Map> listMap=new ArrayList<Map>();
		Map<String,String> map1=new HashMap<String,String>();
		Map<String,List> map2=new HashMap<String,List>();
		List<Map> tempList=new ArrayList<Map>();
		JSONObject json=JSONObject.fromObject(v_json);
		Iterator it = json.keys();
		while(it.hasNext()){  
			String key = (String) it.next();
            Object value = json.get(key);
            if(key.equals("table")){
            	map1.put("table",value.toString());
            }
            if(key.equals("tabledata")){
            	JSONObject tempjson=JSONObject.fromObject(value.toString());
            	Iterator tempit = tempjson.keys();
            	while(tempit.hasNext()){ 
            		String key1 = (String) tempit.next();
            		Object value1 = tempjson.get(key1);
            		map1.put(key1, value1.toString());
            	}
            }
            if(key.equals("dtables")){
            	JSONArray jsonArray = JSONArray.fromObject(value.toString());
            	for(int i=0;i<jsonArray.size();i++){
            		JSONObject job = jsonArray.getJSONObject(i);
            		JSONObject tempjson=JSONObject.fromObject(job.toString());
            		Iterator itTemp = tempjson.keys();
            		while(itTemp.hasNext()){ 
            			String tempKey = (String) itTemp.next();
            			if(tempKey.equals("table")){
            				Object tempValue = tempjson.get(tempKey);
            				System.out.println(tempValue);
            			}
            			if(tempKey.equals("tabledata")){
            				Object tempValue = tempjson.get(tempKey);
            				Map<String,String> tempMap=new HashMap<String,String>();
            				JSONObject tempjson2=JSONObject.fromObject(tempValue.toString());
                        	Iterator tempit2 = tempjson2.keys();
                        	while(tempit2.hasNext()){ 
                        		String tempKey2 = (String) tempit2.next();
                        		tempValue = tempjson2.get(tempKey2);
                        		tempMap.put(tempKey2, tempValue.toString());
                        		
                        	}
                        	tempList.add(tempMap);
            			}
            		}
            		
            	}
            	
            }
        }
		listMap.add(map1);
		if(tempList.size()>0){
			map2.put("dtables",tempList );
			listMap.add(map2);
		}
		
		
		return listMap;
	}
}
