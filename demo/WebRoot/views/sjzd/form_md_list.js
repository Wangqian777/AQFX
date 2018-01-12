$(function(){
	const height = $(this).outerHeight(true)-$('.box-header').outerHeight(true)-2
	$('#left').height(height)
	$('#right').height(height-$('#btns').outerHeight(true))
	dbQueryParams = function (params) {
        var temp = {
            "v_json": "{\"FID\":\""+localStorage.listID+"\"}",
        };
        return temp;
    };
	function TableInit() {
		$('#table').bootstrapTable({
            url: '../../getDatadictionary_mx.do',         //请求后台的URL（*）
            method: 'get',                      //请求方式（*）
            striped: true,                      //是否显示行间隔色
            cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: true,                   //是否显示分页（*）
            sortable: false,                     //是否启用排序
            sortOrder: "asc",                   //排序方式
            queryParams: dbQueryParams,			//传递参数（*）
            sidePagination: "client",           //分页方式：client客户端分页，server服务端分页（*）
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
                field: '名称',
                title: '明细名称'
            }, {
                field: '创建时间',
                title: '创建时间',
                formatter:function(value,row,index){
                	var date = new Date();
                	if(value!=null){
                		date.setTime(value.time);
                        var y = date.getFullYear();
                        var m = date.getMonth()+1;
                        m = m<10?'0'+m:m;
                        var s = date.getSeconds();
                        var d = date.getDate();
                        d = d<10?("0"+d):d;
                        var h = date.getHours();
                        h = h<10?("0"+h):h;
                        var M = date.getMinutes();
                        M = M<10?("0"+M):M;
                        var S = date.getSeconds();
                        S = S<10?("0"+S):s;
                        var str = y+"-"+m+"-"+d+" "+h+":"+M+":"+S;
                        return str;
                	}else{
                		return "";
                	}
                    
                }
            } ,{
            	field:'是否禁用',
            	title:'是否禁用',
            	formatter:function(value,row,index){
                	if(value==false){
                		return "否";
                	}else{
                		return "是";
                	}
                }
            }]
        });
	};
	initList();
	TableInit();
	$("body").delegate(".list-group-item","click", function(){
		$(this).css({"background-color":"#428BCA","color":"#FFFFFF"});
		$(this).siblings().css({"background-color":"#FFFFFF","color":"#333333"});
		localStorage.listID=$(this).attr("name");
		$("#tb_departments").bootstrapTable('refresh'); 
	});
	$("#add").on('click',function(){
		localStorage.FormMode="Add";
		openFormCard("form_md.html","新增数据字典类别");
		
	});                                                                                                                                                                                          
	$("#edit").click(function(){
		localStorage.FormMode="Edit";
		localStorage.sjzdID=localStorage.listID;
		openFormCard("form_md.html","修改数据字典类别");
	});
	$("#delete").click(function(){
		layer.confirm('确认删除吗？', {  
	        btn: ['确定','取消'] //按钮  
	    },function (index) {
	    	layer.close(index);
	    	var json={"zhubiao":"数据字典","zhubiaoID":localStorage.listID,"zibiao":"数据字典_明细"};
	    	FormAction(json,"D");
	    });  
	});
	function openFormCard(url,title) {
		 layer.open({
				type:2,
				title:'<span style="font-size:14px;font-weight: bold;">'+title+'<span>',
				maxmin:true,
				shadeClose:true,
				offset:'auto',
				area:['800px','500px'],
				content:[url,'no'],
				end: function(){
					initList();
					$("#tb_departments").bootstrapTable('refresh'); 
				}
			});
	 }
	function initList(){
		$.ajax({
			url:"../../getDatadictionaryList.do",
			type:"POST",
			dataType:"JSON",
			async:false,
			success:function(data){
				var ulHtml="<ul class='list-group'>";
				for(var i=0;i<data.length;i++){
					if(i==0)
						localStorage.Name=data[i].名称;
					ulHtml+="<li class='list-group-item' name='"+data[i].ID+"'>"+data[i].名称+"</li>";
				}
				ulHtml+="</ul>";
				$("#list").html(ulHtml);
				$(".list-group-item").eq(0).css({"background-color":"#428BCA","color":"#FFFFFF"});
				localStorage.listID=$(".list-group-item").eq(0).attr("name");
			}
		});
	}
	$("#新增").click(function(){
		localStorage.FormMode="Add";
		localStorage.FID=localStorage.listID
		openFormCard("form_add.html","新增数据字典明细");
	});
	$("#编辑").click(function(){
		var dataArray= $("#tb_departments").bootstrapTable('getSelections');
		if(dataArray.length==0){
			layer.msg("请选择数据行！");
			return;
		}
		localStorage.sjzdmxID=dataArray[0].ID;
		localStorage.FormMode="Edit";
		openFormCard("form_add.html","新增数据字典明细");
	});
	$("#删除").click(function(){
		var dataArray= $("#tb_departments").bootstrapTable('getSelections');
		if(dataArray.length==0){
			layer.msg("请选择数据行！");
			return;
		}
		layer.confirm('确认删除吗？', {  
	        btn: ['确定','取消'] //按钮  
	    },function (index) {
	    	layer.close(index);
	    	localStorage.sjzdmxID=dataArray[0].ID;
			var json={"zhubiao":"数据字典_明细","zhubiaoID":localStorage.sjzdmxID,};
	        var __str= JSON.stringify(json);
			 $.ajax({
					type:"POST",
					url:"../../SingleJson.do",
					data:{"v_json":__str,"action":"D"},
					dataType:"JSON",
					async:false,
					success:function(data){
						
						if(data.state==1){
							layer.msg("操作成功");
							$("#tb_departments").bootstrapTable('refresh');
						}else{
							layer.msg("操作失败");
						}
					}
			});
	    });  
		
	});
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
						initList();
						$("#tb_departments").bootstrapTable('refresh'); 
					}else{
						layer.msg("操作失败");
					}
				}
			});
	 }
});