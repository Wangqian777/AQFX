package service.impl;

import java.util.LinkedHashMap;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import dao.DataDao;

import service.DataService;
@Service
public class DataServiceImpl implements DataService {
	@Autowired
	private DataDao dataDao;
	public List<LinkedHashMap<String, Object>> getData(String sql) {
		return dataDao.getData(sql);
	}
	public boolean updateData(String sql) {
		if(dataDao.updateData(sql)>0)
			return true;
		return false;
	}
	public boolean insertData(String sql) {
		if(dataDao.insertData(sql)>0)
			return true;
		return false;
	}
	public int getDataCounts(String sql) {
		return dataDao.getDataCounts(sql);
	}
	public boolean deleteData(String sql) {
		if(dataDao.deleteData(sql)>0)
			return true;
		return false;
	}
	public boolean dropTable(String tableName) {
		if(dataDao.dropTable(tableName)>0)
			return true;
		return false;
	}
	public void setDataDao(DataDao dataDao) {
		this.dataDao = dataDao;
	}
	
	
	
	
}
