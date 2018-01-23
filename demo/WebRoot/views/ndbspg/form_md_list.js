$(function(){
	dbQueryParams = function (params) {

		var listSql="select * from 辨识评估 where 单据类型='年度辨识评估'";
        var temp = {
            'params' : JSON.stringify(params),
            'listSql':listSql
        };
        return temp;
    };
	function TableInit() {
		$('#table').bootstrapTable({
            url: '../../getPageData.do',         //请求后台的URL（*）
            method: 'get',                      //请求方式（*）
            striped: true,                      //是否显示行间隔色
            cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: true,                   //是否显示分页（*）
            sortable: false,                     //是否启用排序
            sortOrder: "asc",                   //排序方式
            queryParamsType : "a",
            queryParams: dbQueryParams,			//传递参数（*）
            sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
            pageNumber:1,                       //初始化加载第一页，默认第一页
            pageSize: 10,                       //每页的记录行数（*）
            pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
            search: false,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
            strictSearch: true,
            showColumns: false,                  //是否显示所有的列
            showRefresh: false,                  //是否显示刷新按钮
            minimumCountColumns: 2,             //最少允许的列数
            clickToSelect: true,                //是否启用点击选中行
            height: 500,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
            uniqueId: "ID",                     //每一行的唯一标识，一般为主键列
            showToggle:false,                    //是否显示详细视图和列表视图的切换按钮
            cardView: false,                    //是否显示详细视图
            detailView: false,                   //是否显示父子表
            singleSelect : true,				//单选 
            columns: [{
                checkbox: true
            },{
            	field:'ID',
            	title:'ID',
            	visible:false
            }, {
                field: '辨识日期',
                title: '辨识日期',
                valign: 'middle',
                visible: true
            } ,{
            	field:'名称',
            	title:'名称',
            	valign: 'middle',
                visible: true
            },{
            	field:"单据类型",
            	title:"辨识类别",
            	valign: 'middle',
                visible: true
            },{
            	field:"负责人",
            	title:"负责人",
            	valign: 'middle',
                visible: true
            },{
            	field:"参加人",
            	title:"参加人",
            	valign: 'middle',
                visible: true
            },{
            	field:"辨识方法",
            	title:"辨识方法",
            	valign: 'middle',
                visible: true
            }]
        });
	};
	TableInit();
	$("#btntable-add").click(function(){
		localStorage.FormMode="Add";
		openFormCard("form_md.html","新增年度辨识评估");
	});
	$("#btntable-edit").click(function(){
		var dataArray= $("#table").bootstrapTable('getSelections');
		if(dataArray.length==0){
			layer.msg("请选择数据行！");
			return;
		}
		localStorage.ndbsId=dataArray[0].ID;
		localStorage.FormMode="Edit";
		openFormCard("form_md.html","编辑年度辨识评估");
	});
	$("#btntable-delete").click(function(){
		var dataArray= $("#table").bootstrapTable('getSelections');
		if(dataArray.length==0){
			layer.msg("请选择数据行！");
			return;
		}
		var flag=true;
		localStorage.ndbsId=dataArray[0].ID;
		layer.confirm('确认删除吗？', {  
	        btn: ['确定','取消'] //按钮  
	    },function (index) {
	    	layer.close(index);
	    	var json={"FID":localStorage.ndbsId,"table":"附件"};
	    	var __str= JSON.stringify(json);
	    	var filePathArry=new Array();
	    	$.ajax({
	    		url:"../../getListData.do",
	    		type:"POST",
	    		data:{"v_json":__str},
	    		dataType:"JSON",
	    		async:false,
	    		success:function(data){
	    			for(var i=0;i<data.length;i++){
	    				filePathArry.push(data[i].文件路径);
	    			}
	    		}
	    	});
	    	var json={"zhubiao":"辨识评估","zhubiaoID":localStorage.ndbsId,"zibiao":"附件"};
	    	if(filePathArry.length>0){
	    		json.wenjian=filePathArry;
	    	}
	    	FormAction(json,"D");
	    }); 
	});
	$("#btntable-view").click(function(){
		var dataArray= $("#table").bootstrapTable('getSelections');
		if(dataArray.length==0){
			layer.msg("请选择数据行！");
			return;
		}
		localStorage.ndbsId=dataArray[0].ID;
		localStorage.FormMode="View";
		openFormCard("form_md.html","查看年度辨识评估");
	});
	$("#btntable-refresh").click(function(){
		$("#table").bootstrapTable('refresh');
	});
	function openFormCard(url,title) {
		 layer.open({
				type:2,
				title:'<span style="font-size:14px;font-weight: bold;">'+title+'<span>',
				maxmin:true,
				shadeClose:true,
				offset:'auto',
				area:['900px', '600px'],
				content:[url],
				end: function(){
					$("#table").bootstrapTable('refresh'); 
				}
			});
	 }
	function FormAction(data,action){
		var __str= JSON.stringify(data);
		$.ajax({
			type:"POST",
			url:"../../manyJson.do",
			data:{"v_json":__str,"action":action},
			dataType:"JSON",
			async:false,
			success:function(data){
				if(data.state==1){
					layer.msg("操作成功");
					$("#table").bootstrapTable('refresh'); 
				}else{
					layer.msg("操作失败");
				}
			}
		});
	}
});
	