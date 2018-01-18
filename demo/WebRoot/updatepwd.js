$(function(){
	$("#btntable-chongzhi").attr("disabled", "true");
	$("#btntable-save").click(function(){
		var ypwd=$("#原密码").val();
		var xpwd=$("#新密码").val();
		var zpwd=$("#密码").val();
		var pwd=JSON.parse(localStorage.user).密码;
		if(ypwd==null||ypwd==""){
			layer.msg("原密码不能为空");
			return;
		}
		if(xpwd==null||xpwd==""){
			layer.msg("新密码不能为空");
			return;
		}
		if(zpwd==null||zpwd==""){
			layer.msg("确认密码不能为空");
			return;
		}
		if(ypwd!=pwd){
			layer.msg("原密码输入不正确");
			return;
		}
		if(xpwd!=zpwd){
			layer.msg("新密码和确认密码不符");
			return;
		}
		var action = "M";
		var json = {};
		var data;
		data = $("#frmdata").serializeObject();
		json.table = $("#frmdata").data("table");
		json.tabledata = data;
		FormAction(json, action)
	});
	function FormAction(data, action) {
		var __str = JSON.stringify(data);
		$.ajax({
			type : "POST",
			url : "../../SingleJson.do",
			data : {
				"v_json" : __str,
				"action" : action
			},
			dataType : "JSON",
			async : false,
			success : function(data) {
				if (data.state == 1) {
					layer.msg("操作成功");
				} else {
					layer.msg("操作失败");
				}
			}
		});
	}
});