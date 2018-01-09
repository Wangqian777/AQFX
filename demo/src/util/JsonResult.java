package util;

import java.io.Serializable;
import java.util.List;

import net.sf.json.JSON;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class JsonResult implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private Object data;
	private String message;
	private Integer state;

	
	public Object getData() {
		return data;
	}

	public void setData(Object data) {
		this.data = data;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public Integer getState() {
		return state;
	}

	public void setState(Integer state) {
		this.state = state;
	}

	public JsonResult() {
	}

	
	
	public JsonResult(Object data, String message, Integer state) {
		super();
		this.data = data;
		this.message = message;
		this.state = state;
	}
	public static JsonResult Success() {
		return new JsonResult(null, null, 1);
	}
	public static JsonResult Success(Object Data, String Message) {
		return new JsonResult(Data, Message, 1);
	}
	public static JsonResult Error() {
		return new JsonResult(null, null, 0);
	}
	public static JsonResult Error(Object Data, String Message) {
		return new JsonResult(Data, Message, 0);
	}
	
	public JSONObject toJson() {
		JSONObject json = JSONObject.fromObject(this);
		return json;
	}
}
