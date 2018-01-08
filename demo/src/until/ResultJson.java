package until;


public class ResultJson {
	private String State;
	private String rows;
	private Integer total;
	public ResultJson() {
	}
	
	public ResultJson( String state, String data, Integer total) {
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

	public String getRows() {
		return rows;
	}

	public void setRows(String rows) {
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
