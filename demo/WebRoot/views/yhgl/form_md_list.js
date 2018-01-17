$(function() {
	const height = $(this).outerHeight(true) - $('.box-header').outerHeight(true) - 2
	$('#left').height(height)
	$('#right').height(height - $('#btns').outerHeight(true))
	dbQueryParams = function(params) {
		if ($('#username').val() != null && $('#username').val() != '') {
			params.用户姓名 = $('#username').val();
		}
		if ($('#logioname').val() != null && $('#logioname').val() != '') {
			params.登录名 = $('#logioname').val();
		}
		if($('#username').val() ==''&&$('#logioname').val() ==''){
			params.业务科室 = localStorage.userID;
		} 
		params.用户类别 = '用户';
		var temp = { 
			'params' : JSON.stringify(params),
			'table' : '用户'
		};
		return temp;
	};
	$('#btntable-search').click(function() {
		$("#table").bootstrapTable('refresh');
	});
	initTree();
	function initTree() {
		$.ajax({
			type : "POST",
			url : "../../getTreeJson.do",
			dataType : "JSON",
			data : {
				"table" : "部门",
				"orderBy" : "编码"
			},
			async : false,
			success : function(data) {
				for (var i = 0; i < data.length; i++) {
					data[i].state = {
						"expanded" : false
					};
				}
				$('#treeview').treeview({
					data : data, // 数据源
					showCheckbox : false, //是否显示复选框
					highlightSelected : true, //是否高亮选中
					emptyIcon : '', //没有子节点的节点图标
					collapseIcon : "glyphicon glyphicon-chevron-right",
					expandIcon : "glyphicon glyphicon-chevron-down",
					multiSelect : false, //多选
					onNodeChecked : function(event, data) {},
					onNodeSelected : function(event, data) {
						localStorage.userID = data["ID"];
						localStorage.buname = data["text"]
						$("#table").bootstrapTable('refresh');
						if (data.state.expanded == false) {
							$('#treeview').treeview('expandNode', [ data.nodeId, {
								silent : true
							} ]);
							var arrnode = $('#treeview').treeview('getSiblings', data.nodeId);
							for (var i = 0; i <= arrnode.length; i++) {
								$('#treeview').treeview('collapseNode', [ arrnode[i], {
									silent : true,
									ignoreChildren : false
								} ]);
							}
						} else {
							$('#treeview').treeview('collapseNode', [ data.nodeId, {
								silent : true
							} ]);
						}
					}
				});

			}
		});
	}
	function TableInit() {
		$('#table').bootstrapTable({
			url : '../../getPageData.do', //请求后台的URL（*）
			method : 'get', //请求方式（*）
			striped : true, //是否显示行间隔色
			cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			pagination : true, //是否显示分页（*）
			sortable : false, //是否启用排序
			sortOrder : "asc", //排序方式
			queryParamsType : "a",
			queryParams : dbQueryParams, //传递参数（*）
			sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
			pageNumber : 1, //初始化加载第一页，默认第一页
			pageSize : 10, //每页的记录行数（*）
			pageList : [ 10, 25, 50, 100 ], //可供选择的每页的行数（*）
			search : false, //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
			strictSearch : true,
			showColumns : false, //是否显示所有的列
			showRefresh : false, //是否显示刷新按钮
			minimumCountColumns : 2, //最少允许的列数
			clickToSelect : true, //是否启用点击选中行
			height : 500, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
			uniqueId : "ID", //每一行的唯一标识，一般为主键列
			showToggle : false, //是否显示详细视图和列表视图的切换按钮
			cardView : false, //是否显示详细视图
			detailView : false, //是否显示父子表
			singleSelect : true, //单选 
			columns : [ {
				checkbox : true
			}, {
				field : 'ID',
				title : 'ID',
				visible : false
			}, {
				field : '用户姓名',
				title : '用户姓名',
				valign : 'middle',
				width : 100,
				visible : true
			}, {
				field : "登录名",
				title : "登录名",
				valign : 'middle',
				visible : true
			}, {
				field : "禁用",
				title : "是否禁用",
				width : 80,
				formatter : function(value, row, index) {
					if (value == 0) {
						return "否";
					} else if (value == 1) {
						return "是";
					}
				}
			}, {
				field : "用户类别",
				title : "用户类别",
				valign : 'middle',
				visible : true
			}, {
				field : "性别",
				title : "性别",
				width : 80,
				formatter : function(value, row, index) {
					if (value == 0) {
						return "男";
					} else if (value == 1) {
						return "女";
					}
				}
			}, {
				field : "电话",
				title : "电话",
				valign : 'middle',
				visible : true
			} ]
		});
	}
	;
	initList();
	TableInit();
	$("body").delegate(".list-group-item", "click", function() {
		$(this).css({
			"background-color" : "#428BCA",
			"color" : "#FFFFFF"
		});
		$(this).siblings().css({
			"background-color" : "#FFFFFF",
			"color" : "#333333"
		});
		localStorage.userID = $(this).attr("name");
		$("#table").bootstrapTable('refresh');
	});
	$("#add").on('click', function() {
		localStorage.FormMode = "Add";
		openFormCard("form_md.html", "新增数据字典类别");

	});
	$("#edit").click(function() {
		localStorage.FormMode = "Edit";
		localStorage.sjzdID = localStorage.listID;
		openFormCard("form_md.html", "修改数据字典类别");
	});
	$("#delete").click(function() {
		layer.confirm('确认删除吗？', {
			btn : [ '确定', '取消' ] //按钮  
		}, function(index) {
			layer.close(index);
			var json = {
				"zhubiao" : "数据字典",
				"zhubiaoID" : localStorage.listID,
				"zibiao" : "数据字典_明细"
			};
			FormAction(json, "D");
		});
	});
	function openFormCard(url, title) {
		layer.open({
			type : 2,
			title : '<span style="font-size:14px;font-weight: bold;">' + title + '<span>',
			maxmin : true,
			shadeClose : true,
			offset : 'auto',
			area : [ '800px', '500px' ],
			content : [ url, 'no' ],
			end : function() {
				initList();
				$("#table").bootstrapTable('refresh');
			}
		});
	}
	function initList() {
		$.ajax({
			url : "../../getDatadictionaryList.do",
			type : "POST",
			dataType : "JSON",
			async : false,
			success : function(data) {
				var ulHtml = "<ul class='list-group'>";
				for (var i = 0; i < data.length; i++) {
					if (i == 0)
						localStorage.Name = data[i].名称;
					ulHtml += "<li class='list-group-item' name='" + data[i].ID + "'>" + data[i].名称 + "</li>";
				}
				ulHtml += "</ul>";
				$("#list").html(ulHtml);
				$(".list-group-item").eq(0).css({
					"background-color" : "#428BCA",
					"color" : "#FFFFFF"
				});
				localStorage.userID = $(".list-group-item").eq(0).attr("name");
			}
		});
	}
	$("#新增").click(function() {
		localStorage.FormMode = "Add";
		localStorage.业务科室 = localStorage.userID;
		localStorage.业务科室名称 = localStorage.buname;
		if (localStorage.业务科室 == "undefined") {
			layer.msg("请选择左侧节点");
			return;
		}
		openFormCard("form_add.html", "新增用户");
	});
	$("#编辑").click(function() {
		var dataArray = $("#table").bootstrapTable('getSelections');
		if (dataArray.length == 0) {
			layer.msg("请选择数据行！");
			return;
		}
		localStorage.业务科室名称 = localStorage.buname;
		localStorage.yhID = dataArray[0].ID;
		localStorage.FormMode = "Edit";
		openFormCard("form_add.html", "修改用户信息");
	});
	$("#重置密码").click(function() {
		var dataArray = $("#table").bootstrapTable('getSelections');
		if (dataArray.length == 0) {
			layer.msg("请选择数据行！");
			return;
		}
		layer.confirm('确认重置密码吗？', {
			btn : [ '确定', '取消' ] //按钮  
		}, function(index) {
			layer.close(index);
			localStorage.yhID = dataArray[0].ID;
			var json = {
				"table" : "用户",
				"tabledata" : {
					"id" : localStorage.yhID,
					"密码" : "123456"
				}
			};
			var __str = JSON.stringify(json);
			$.ajax({
				type : "POST",
				url : "../../SingleJson.do",
				data : {
					"v_json" : __str,
					"action" : "M"
				},
				dataType : "JSON",
				async : false,
				success : function(data) {

					if (data.state == 1) {
						layer.msg("操作成功");
						$("#table").bootstrapTable('refresh');
					} else {
						layer.msg("操作失败");
					}
				}
			});
		});
	});
	$("#删除").click(function() {
		var dataArray = $("#table").bootstrapTable('getSelections');
		if (dataArray.length == 0) {
			layer.msg("请选择数据行！");
			return;
		}
		layer.confirm('确认删除吗？', {
			btn : [ '确定', '取消' ] //按钮  
		}, function(index) {
			layer.close(index);
			localStorage.yhID = dataArray[0].ID;
			var json = {
				"zhubiao" : "用户",
				"zhubiaoID" : localStorage.yhID,
			};
			var __str = JSON.stringify(json);
			$.ajax({
				type : "POST",
				url : "../../SingleJson.do",
				data : {
					"v_json" : __str,
					"action" : "D"
				},
				dataType : "JSON",
				async : false,
				success : function(data) {

					if (data.state == 1) {
						layer.msg("操作成功");
						$("#table").bootstrapTable('refresh');
					} else {
						layer.msg("操作失败");
					}
				}
			});
		});

	});
	function FormAction(data, action) {
		var __str = JSON.stringify(data);
		$.ajax({
			type : "POST",
			url : "../../manyJson.do",
			data : {
				"v_json" : __str,
				"action" : action
			},
			dataType : "JSON",
			async : false,
			success : function(data) {
				if (data.state == 1) {
					layer.msg("操作成功");
					initList();
					$("#table").bootstrapTable('refresh');
				} else {
					layer.msg("操作失败");
				}
			}
		});
	}
});