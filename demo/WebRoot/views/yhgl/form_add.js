$(function(){
	$("#业务科室").val(localStorage.业务科室);
	$("#业务科室名称").val(localStorage.业务科室名称);
	$("#id").val(localStorage.yhID);
	$("#创建人").val(JSON.parse(localStorage.user).用户姓名);
	if(localStorage.FormMode=="Edit"){
		var json = { "ID": localStorage.yhID,"table":"用户"};
		var __str= JSON.stringify(json);
		$.ajax({
			url:"../../getListData.do",
			type:"POST",
			data:{"v_json":__str},
			dataType:"JSON",
			async:false,
			success:function(data){
				console.log(data);
				$("#frmdata").fill(data[0], { styleElementName: 'none' });
				var flag;
				if(data[0].禁用=="0"){
					flag=false;
				}else{
					flag=true;
				}
				$("input[name=禁用]").attr("checked",flag); 
				$("#id").val(data[0].ID);
			}
		});
	}
	$("#btntable-save").click(function(){
		var json = {};
		var action="";
		var data;
		if(localStorage.FormMode=="Add"){
			action="C";
		}else{
	        action="M";
		}
		data = $("#frmdata").serializeObject();
		json.table = $("#frmdata").data("table");
        json.tabledata = data;
        FormAction(json,action);
	});
	function FormAction(data,action){
		 var __str= JSON.stringify(data);
		 $.ajax({
				type:"POST",
				url:"../../SingleJson.do",
				data:{"v_json":__str,"action":action},
				dataType:"JSON",
				async:false,
				success:function(data){
					if(data.state==1){
						layer.msg("操作成功");
					}else{
						layer.msg("操作失败");
					}
				}
			});
	 }
});