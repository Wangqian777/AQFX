package util;

import java.io.Serializable;
import java.util.List;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class PageResult implements Serializable {
	private List rows;
	private Integer total;
	private Integer state;

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

	public Integer getState() {
		return state;
	}

	public void setState(Integer state) {
		this.state = state;
	}

	public PageResult() {
	}

	public PageResult(List Rows, Integer Total, Integer State) {
		super();
		rows = Rows;
		total = Total;
		state = State;
	}
	
	public static PageResult Success(List Rows, Integer Total) {
		return new PageResult(Rows, Total, Rows.size());
	}
	public static PageResult Error() {
		return new PageResult(null, 0, 0);
	}
	
	public JSONObject toJson() {
		JSONObject json = JSONObject.fromObject(this);
		return json;
	}
}
