package dao;

import java.util.LinkedHashMap;
import java.util.List;


public interface DataDao {
	public List<LinkedHashMap<String, Object>> getData(String sql);
	public int updateData(String sql);
	public int insertData(String sql);
	public int getDataCounts(String sql);
	public int deleteData(String sql);
	public int dropTable(String tableName);
}
