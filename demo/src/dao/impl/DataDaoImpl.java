package dao.impl;

import java.util.LinkedHashMap;
import java.util.List;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.support.SqlSessionDaoSupport;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import dao.DataDao;
import util.ResultJson;
@Repository
public class DataDaoImpl extends SqlSessionDaoSupport implements DataDao {
	@Autowired
	public void setSqlSessionFactory(SqlSessionFactory sqlSessionFactory) {
		super.setSqlSessionFactory(sqlSessionFactory);
	}
	public List<LinkedHashMap<String, Object>> getData(String sql) {
		return getSqlSession().selectList("nsDataDao.getData",sql);
	}
	public List<LinkedHashMap<String, Object>> getPageData(String sql) {
		return getSqlSession().selectList("nsDataDao.getPageData",sql);
	}
	public int updateData(String sql) {
		return getSqlSession().update("nsDataDao.updateData",sql);
	}
	public int insertData(String sql) {
		return getSqlSession().insert("nsDataDao.insertData",sql);
	}
	public int getDataCounts(String sql) {
		return getSqlSession().selectOne("nsDataDao.getDataCounts",sql);
	}
	public int getDataTotal(String tableName) {
		return getSqlSession().selectOne("nsDataDao.getDataTotal",tableName);
	}
	public int deleteData(String sql) {
		return getSqlSession().delete("nsDataDao.deleteData",sql);
	}
	public int dropTable(String tableName) {
		return getSqlSession().update("nsDataDao.dropTable",tableName);
	}
	

}
