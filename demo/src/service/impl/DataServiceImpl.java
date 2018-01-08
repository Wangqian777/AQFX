package service.impl;

import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import dao.DataDao;
import net.sf.json.JSONObject;
import service.DataService;
import util.ResultJson;

@Service
public class DataServiceImpl implements DataService {
	@Autowired
	private DataDao dataDao;

	public List<LinkedHashMap<String, Object>> getData(String sql) {
		return dataDao.getData(sql);
	}

	public ResultJson getPageData(String table, String params) {
		String sql = "";
		String where = "";
		Integer begin = 0, end = 0;
		Integer total = dataDao.getDataTotal(table);
		if (params != null) {
			JSONObject json = JSONObject.fromObject(params);
			Iterator it = json.keys();
			while (it.hasNext()) {
				String key = (String) it.next();
				String value = json.get(key).toString();
				if (value.equals("pageSize"))
					where += String.format(" and %s='%s'", key, value.toString());
			}
			Integer pageSize = json.getInt("pageSize");
			Integer pageNumber = json.getInt("pageNumber");

			if (null == pageNumber || pageNumber < 1) {
				pageNumber = 1;
				if (pageNumber > total) {
					pageNumber = total;
				}
				begin = (pageNumber - 1) * pageSize;
				end = pageNumber * pageSize;
			}
		}
		sql = String.format("SELECT * FROM (SELECT ROWNUM AS rn, t.* FROM %s WHERE rn <= %d %s) tt WHERE tt.rn >= %d;",
				table, end, where, begin);

		List<LinkedHashMap<String, Object>> data = dataDao.getData(sql);
		ResultJson page = new ResultJson("1",data,total);
		return page;
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
