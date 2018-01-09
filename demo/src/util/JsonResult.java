package util;

import java.util.List;

public class ResultJson {
	private String State;
	private List rows;
	private Integer total;
	public ResultJson() {
	}
	
	public ResultJson( String state, List data, Integer total) {
		super();
		State = state;
		rows = data;
		this.total = total;
	}

	public String getState() {
		return State;
	}

	public void setState(String state) {
		State = state;
	}

	public List getRows() {
		return rows;
	}

	public void setRows(List rows) {
		this.rows = rows;
	}

	public Integer getTotal() {
		return total;
	}

	public void setTotal(Integer total) {
		this.total = total;
	}

	public String  GenerateResultJson(){
		String json="{\"json\":{\"State\":"+getState()+",\"Data\":{\"list\":"+getRows()+"},\"total\":"+getTotal()+"}}";
		return json;
	}
}
