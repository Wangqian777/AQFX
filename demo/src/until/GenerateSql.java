package until;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.UUID;

//import com.sun.script.javascript.JSAdapter;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class GenerateSql {
	public Map<String,List> menuUpdateSql(String v_json){
		List<Map> listMap=new ArrayList<Map>();
		Map<String,List> sqlMap=new HashMap<String, List>();
		List<String> tempList=new ArrayList<String>();
		listMap=currencyJson(v_json);
		String updateSql="";
		String insertSql="";
		String delSql="";
		updateSql=String.format("update %s set ", listMap.get(0).get("table"));
		Map<String,String> map=listMap.get(0);
		//主表
		for(String key:map.keySet()){
			if(!key.equals("id") && !key.equals("table")){
				updateSql+=String.format("%s='%s',",key,map.get(key));
			}
		}
		if(updateSql.substring(updateSql.length()-1).equals(",")){
			updateSql=updateSql.substring(0,updateSql.length()-1);
		}
		updateSql+=String.format(" where id='%s'", map.get("id"))+"";
		tempList.add(updateSql);
		updateSql="";
		sqlMap.put("updateSql", tempList);
		Map<String,List> map2=listMap.get(1);
		if(map2.size()>0){
			List<Map> list=map2.get("dtables");
			tempList=new ArrayList<String>();
			for(Map<String,String> m:list){
				insertSql+=String.format("Insert into %s( ", m.get("table"));
				
				for(String key:m.keySet()){
					if(!key.equals("id") && !key.equals("table")){
						insertSql+=String.format("%s,",key);
					}
				}
				insertSql+="id) values(";
				for(String key:m.keySet()){
					if(!key.equals("id") && !key.equals("table")){
						insertSql+=String.format("'%s',",m.get(key));
					}
				}
				UUID uuid=UUID.randomUUID();
				insertSql+=String.format("'%s')\n", uuid);
				tempList.add(insertSql);
				insertSql="";
				for(String key:m.keySet()){
					List<String> deleteList=new ArrayList<String>();
					delSql=String.format("delete from %s where FID='%s'" , m.get("table"),m.get("FID"));
					deleteList.add(delSql);
					sqlMap.put("deleteSql", deleteList);
					break;
				}
			}
			
			sqlMap.put("insertSql", tempList);
			
		}
		return sqlMap;
	}
	public Map<String,List> generateInsertSql(String v_json){
		List<Map> listMap=new ArrayList<Map>();
		Map<String,List> sqlMap=new HashMap<String, List>();
		List<String> tempList=new ArrayList<String>();
		listMap=currencyJson(v_json);
		String zhuInsertSql="";
		String ziInsertSql="";
		String FID="";
		zhuInsertSql=String.format("Insert into %s(", listMap.get(0).get("table"));
		Map<String,String> map=listMap.get(0);
		//主表
		for(String key:map.keySet()){
			if(!key.equals("id") && !key.equals("table")){
				zhuInsertSql+=String.format("%s,",key);
			}
		}
		zhuInsertSql+="id) values(";
		for(String key:map.keySet()){
			if(!key.equals("id") && !key.equals("table")){
				zhuInsertSql+=String.format("'%s',",map.get(key));
			}
		}
		UUID uuid=UUID.randomUUID();
		FID=uuid.toString();
		zhuInsertSql+=String.format("'%s')", uuid);
		tempList.add(zhuInsertSql);
		sqlMap.put("zhuInsertSql", tempList);
		try{
			Map<String,List> map2=listMap.get(1);
			if(map2.size()>0){
				List<Map> list=map2.get("dtables");
				tempList=new ArrayList<String>();
				for(Map<String,String> m:list){
					ziInsertSql+=String.format("Insert into %s( ", m.get("table"));
					
					for(String key:m.keySet()){
						if(!key.equals("id") && !key.equals("table")){
							ziInsertSql+=String.format("%s,",key);
						}
					}
					ziInsertSql+="id,fid) values(";
					for(String key:m.keySet()){
						if(!key.equals("id") && !key.equals("table")){
							ziInsertSql+=String.format("'%s','%s'",m.get(key),FID);
						}
					}
					uuid=UUID.randomUUID();
					ziInsertSql+=String.format("'%s')\n", uuid);
					tempList.add(ziInsertSql);
					ziInsertSql="";
				}
				sqlMap.put("ziInsertSql", tempList);
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
		listMap=currencyJson(v_json);
		String zhuDeleteSql="";
		String ziDeleteSql="";
		String FID="";
		zhuDeleteSql=String.format("delete from %s where ID='%s'", listMap.get(0).get("table"),listMap.get(0).get("id"));
		tempList.add(zhuDeleteSql);
		sqlMap.put("zhuDeleteSql",tempList );
		tempList=new ArrayList<String>();
		try{
			Map<String,List> map2=listMap.get(1);
			if(map2.size()>0){
				List<Map> list=map2.get("dtables");
				for(Map<String,String> m:list){
					ziDeleteSql=String.format("delete from %s where FID='%S'", m.get("table"),listMap.get(0).get("id"));
					tempList.add(ziDeleteSql);
					sqlMap.put("ziDeleteSql", tempList);
					break;
				}
			}
			return sqlMap;
		}catch (Exception e) {
			return sqlMap;
		}
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
