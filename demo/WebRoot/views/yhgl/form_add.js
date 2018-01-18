$(function() {
	$("#id").val(localStorage.yhID);
	$("#创建人").val(JSON.parse(localStorage.user).用户姓名);
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
				$('#tree').treeview({
					data : data, // 数据源
					showCheckbox : false, //是否显示复选框
					highlightSelected : true, //是否高亮选中
					emptyIcon : 'glyphicon', //没有子节点的节点图标
					collapseIcon : "glyphicon glyphicon-chevron-right",
					expandIcon : "glyphicon glyphicon-chevron-down",
					multiSelect : false, //多选
					onNodeChecked : function(event, data) {},
					onNodeSelected : function(event, data) {
						$("#txtModuleType").val(data["text"]);
						$("#业务科室").val(data["ID"]);
						$("#tree").hide();
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
	$("#btntable-chongzhi").click(function() {
		$("#frmdata :input").not(":button, :submit, :reset,  :checkbox, :radio").val("");
		$("#frmdata :input").removeAttr("checked").remove("selected");
		$("#性别")[0].checked = true;
		$("#禁用").prop("checked", false);
		$("#密码").val("123456");
	});
	if (localStorage.FormMode == "Edit") {
		$("#btntable-chongzhi").attr("disabled", "true");
		var json = {
			"ID" : localStorage.yhID,
			"table" : "用户"
		};
		var __str = JSON.stringify(json);
		$.ajax({
			url : "../../getListData.do",
			type : "POST",
			data : {
				"v_json" : __str
			},
			dataType : "JSON",
			async : false,
			success : function(data) {
				console.log(data);
				$("#frmdata").fill(data[0], {
					styleElementName : 'none'
				});
				var flag;
				if (data[0].禁用 == "0") {
					flag = false;
				} else {
					flag = true;
				}
				$("input[name=禁用]").attr("checked", flag);
				$("#id").val(data[0].ID);
				var json = {
					"ID" : $("#业务科室").val(),
					"table" : "部门"
				};
				var __str = JSON.stringify(json);
				$.ajax({
					url : "../../getListData.do",
					type : "POST",
					data : {
						"v_json" : __str
					},
					dataType : "JSON",
					async : false,
					success : function(data) {
						$("#txtModuleType").val(data[0].名称);
					}
				})
			}
		});
	}
	$("#btntable-save").click(function() {
		var json = {};
		var action = "";
		var data;
		if (localStorage.FormMode == "Add") {
			action = "C";
		} else {
			action = "M";
		}
		data = $("#frmdata").serializeObject();
		json.table = $("#frmdata").data("table");
		json.tabledata = data;
		FormAction(json, action);
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