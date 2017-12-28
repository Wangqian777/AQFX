package service;

import java.util.LinkedHashMap;
import java.util.List;

public interface DataService {
	public List<LinkedHashMap<String, Object>> getData(String sql);
	public boolean updateData(String sql);
	public boolean insertData(String sql);
	public int getDataCounts(String sql);
	public boolean deleteData(String sql);
	public boolean dropTable(String tableName);
}
