package service.impl;

import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import dao.DataDao;
import net.sf.json.JSONObject;
import service.DataService;
import utils.JsonResult;
import utils.PageResult;

@Service
public class DataServiceImpl implements DataService {
	@Autowired
	private DataDao dataDao;

	public List<LinkedHashMap<String, Object>> getData(String sql) {
		return dataDao.getData(sql);
	}

	public PageResult getPageData(String listSql, String params) {
		String sql = "";
		Integer begin = 0, end = 0;
		Integer total=0;
		if (params != null) {
			JSONObject json = JSONObject.fromObject(params);
			Integer pageSize = json.getInt("pageSize");
			Integer pageNumber = json.getInt("pageNumber");
//			Iterator it = json.keys();
//			while (it.hasNext()) {
//				String key = (String) it.next();
//				String value = json.get(key).toString();
//				if ("pageSize|pageNumber|searchText|sortName|sortOrder".indexOf(key) == -1) {
//					where += String.format(" and %s='%s'", key, value.toString());
//				}
//			}
//			sql=String.format("select count(1) from %s where 1=1 %s", table,where);
			total = dataDao.getDataTotal("select count(1) from ("+listSql+")");
			if (null == pageNumber || pageNumber < 1) {
				pageNumber = 1;
			}
			if (pageNumber > total) {
				pageNumber = total;
			}
			begin = (pageNumber - 1) * pageSize;
			end = pageNumber * pageSize;
		}
		
		sql = String.format("SELECT * FROM (SELECT ROWNUM RN,A.* FROM (%s) A WHERE ROWNUM <= %d)  WHERE RN > %d",listSql, end, begin);
		List<LinkedHashMap<String, Object>> data = dataDao.getData(sql);
		return PageResult.Success(data, total);
	}

	public boolean updateData(String sql) {
		if (dataDao.updateData(sql) > 0)
			return true;
		return false;
	}

	public boolean insertData(String sql) {
		if (dataDao.insertData(sql) > 0)
			return true;
		return false;
	}

	public int getDataCounts(String sql) {
		return dataDao.getDataCounts(sql);
	}

	public boolean deleteData(String sql) {
		if (dataDao.deleteData(sql) > 0)
			return true;
		return false;
	}

	public boolean dropTable(String tableName) {
		if (dataDao.dropTable(tableName) > 0)
			return true;
		return false;
	}

	public void setDataDao(DataDao dataDao) {
		this.dataDao = dataDao;
	}
}
