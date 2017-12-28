$(function(){
	initTree();
	function initTree(){
		$.ajax({
			type:"POST",
			url:"../../getTreeJson.do",
			dataType:"JSON",
			async:false,
			success:function(data){
				$('#treeview').treeview({
	                data: data,         // 数据源
	                showCheckbox: false,   //是否显示复选框
	                highlightSelected: true,    //是否高亮选中
	                emptyIcon: '',    //没有子节点的节点图标
	                multiSelect: false,    //多选
	                onNodeChecked: function (event,data) {
	                	
	                },
	                onNodeSelected: function (event, data) {
	                	$("#id").val(data["ID"]);
	                	$("#pid").val(data["PID"]);
	                	$("#编码").val(data["编码"]);
	                	$("#名称").val(data["text"]);
	                	$("#图标名").val(data["图标名"]);
	                	$("#路径").val(data["路径"]);
	                	var ywSql=data["列表Sql"];
	                	ywSql=ywSql.replace("text", '名称');
	                	$("#列表Sql").val(ywSql);
	                	$('#tb_departments').bootstrapTable('destroy'); 
	                	if($("#列表Sql").val()!=""){
	               		 localStorage.ywSql=$("#列表Sql").val();
	               		 localStorage.menuId=data["ID"];
	               		 TableInit();
	               	 	}
	                }
	            });
				
			}
		});
	}
	 
	 function openFormQueryCard(mode) {
		 	var index = top.window.layer.open({
	            type: 2,
	            title: '<span style="font-size:14px;font-weight: bold;">'+mode+'<span>',
	            closeBtn: 1,
	            shadeClose: true, //单击遮罩能否关闭
	            maxmin: true, //开启最大化最小化按钮
	            area: ['860px', '500px'],
	            content: 'views/cdgl/form_md.html',
	            cancel: function (index, layero) {
	               
	            },
	            end: function () {
	            	initTree();
	            }
	        });

	        localStorage.layerindex = index; //用于关闭层
	 }
	 $("#btntable-save").click(function(){
		 if($("#id").val()==""){
			 layer.msg("请选择左侧节点");
			 return;
		 }
		 var json = {};
         var data = $("#frmdata").serializeObject(); 
         json.table = $("#frmdata").data("table");
         json.tabledata = data;
         json.dtables = [];
         var allTableData = $("#tb_departments").bootstrapTable('getData');
         for(var i=0;i<allTableData.length;i++){
        	 allTableData[i].FID=$("#id").val();
        	 allTableData[i].table=$("#tb_departments").data("table"),
        	 json.dtables.push({tabledata: allTableData[i] });
         }
         console.log(json);
         FormAction(json,"M");
	 });
	 $("#btntable-addtj").click(function(){
		 if($("#id").val()==""){
			 layer.msg("请选择左侧节点");
			 return;
		 }
		 localStorage.PID=$("#pid").val();
		 openFormQueryCard("新增同级");
		 
	 });
	 $("#btntable-addxj").click(function(){
		 if($("#id").val()==""){
			 layer.msg("请选择左侧节点");
			 return;
		 }
		 localStorage.PID=$("#id").val();
		 openFormQueryCard("新增下级");
		 
	 });
	 $("#btntable-delete").click(function(){
		 var flag=true;
		 if($("#id").val()==""){
			 layer.msg("请选择左侧节点");
			 return;
		 }
		 
		 $.ajax({
			 url:"../../getDataCounts.do",
			 type:"POST",
			 data:{"id":$("#id").val(),"table":"菜单"},
			 dataType:"JSON",
			 asnyc:false,
			 success:function(data){
				 if(data.json.State==0){
					 flag=false;
				 }
				 if(flag){
					 var json = {};
			         var data = $("#frmdata").serializeObject(); 
			         json.table = $("#frmdata").data("table");
			         json.tabledata = data;
			         json.dtables = [];
			         var allTableData = $("#tb_departments").bootstrapTable('getData');
			         for(var i=0;i<allTableData.length;i++){
			        	 allTableData[i].FID=$("#id").val();
			        	 allTableData[i].table=$("#tb_departments").data("table"),
			        	 json.dtables.push({tabledata: allTableData[i] });
			         }
			         FormAction(json,"D");
				 }else{
					 layer.msg("存在子节点，无法删除");
				 } 
			 }
		 });
		 
	 });
	 $("#btntable-refresh").click(function(){
		 $('#tb_departments').bootstrapTable('destroy'); 
     	if($("#列表Sql").val()!=""){
     		localStorage.ywSql=$("#列表Sql").val();
     		localStorage.menuId=$("id").val();
     		TableInit();
    	}
	 });
	 function FormAction(data,action){
		 var __str= JSON.stringify(data);
		 $.ajax({
				type:"POST",
				url:"../../menuManage.do",
				data:{"v_json":__str,"action":action},
				dataType:"JSON",
				async:false,
				success:function(data){
					if(data.json.State==1){
						layer.msg("操作成功");
						$('#tb_departments').bootstrapTable('destroy'); 
						TableInit();
						initTree();
					}else{
						layer.msg("操作失败");
						initTree();
					}
				}
			});
	 }
	 dbQueryParams = function (params) {
	        var temp = {
	            "ywSql":  localStorage.ywSql,
	            "menuId":  localStorage.menuId,
	        };
	        return temp;
	    };
		var TableInit = function () {
			$('#tb_departments').bootstrapTable({
	            url: '../../getDBTableColumnsBySql.do',         //请求后台的URL（*）
	            method: 'get',                      //请求方式（*）
	            toolbar: '#toolbar',                //工具按钮用哪个容器
	            striped: true,                      //是否显示行间隔色
	            cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
	            sortable: false,                     //是否启用排序
	            sortOrder: "asc",                   //排序方式
	            queryParams: dbQueryParams,//传递参数（*）
	            search: false,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
	            strictSearch: false,
	            showColumns: false,                  //是否显示所有的列
	            showRefresh: false,                  //是否显示刷新按钮
	            minimumCountColumns: 2,             //最少允许的列数
	            clickToSelect: true,                //是否启用点击选中行
	           // height: 400,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
	            uniqueId: "ID",                     //每一行的唯一标识，一般为主键列
	            showToggle:false,                    //是否显示详细视图和列表视图的切换按钮
	            cardView: false,                    //是否显示详细视图
	            detailView: false,                   //是否显示父子表
	            columns: [{
	                checkbox: false
	            }, {
	                field: '名称',
	                title: '列名'
	            }, {
	                field: '是否显示',
	                title: '是否显示',
	                editable: {
	                    type: 'select',
	                    title: '是否显示',
	                    mode: "inline", 
	                    source:[{value:"1",text:"是"},{value:"0",text:"否"}]
	                }
	            }, ]
	            
	        });
		};
});