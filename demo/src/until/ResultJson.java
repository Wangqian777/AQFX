package until;


public class ResultJson {
	private String State;
	private String Data;
	private Integer total;
	public ResultJson() {
	}
	
	public ResultJson( String state, String data, Integer total) {
		super();
		State = state;
		Data = data;
		this.total = total;
	}

	public String getState() {
		return State;
	}

	public void setState(String state) {
		State = state;
	}

	public String getData() {
		return Data;
	}

	public void setData(String data) {
		Data = data;
	}

	public Integer getTotal() {
		return total;
	}

	public void setTotal(Integer total) {
		this.total = total;
	}

	public String  GenerateResultJson(){
		String json="{\"json\":{\"State\":"+getState()+",\"Data\":{\"list\":"+getData()+"},\"total\":"+getTotal()+"}}";
		return json;
	}
}
