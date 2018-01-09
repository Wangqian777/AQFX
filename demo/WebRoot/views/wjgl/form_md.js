$(document).ready(function () {
    bmflag = 1;
    zbflag = 1;
    $(".cm-dropdown-menu").off("click").on("click", function (e) {
        e.stopPropagation();
    });
    //---------------------------
    var isDisabled = true; //禁用
    //----------------
    //修改验证提示信息
    (function ($) {
        $.extend($.validator.messages, {
            required: "必填信息",
            remote: "请修正该信息",
            email: "请输入正确格式的电子邮件",
            url: "请输入合法的网址",
            date: "请输入合法的日期",
            dateISO: "请输入合法的日期 (ISO).",
            number: "请输入合法的数字",
            digits: "只能输入整数",
            creditcard: "请输入合法的信用卡号",
            equalTo: "请再次输入相同的值",
            accept: "请输入拥有合法后缀名的字符串",
            maxlength: $.validator.format("请输入一个长度最多是 {0} 的字符串"),
            minlength: $.validator.format("请输入一个长度最少是 {0} 的字符串"),
            rangelength: $.validator.format("请输入一个长度介于 {0} 和 {1} 之间的字符串"),
            range: $.validator.format("请输入一个介于 {0} 和 {1} 之间的值"),
            max: $.validator.format("请输入一个最大为 {0} 的值"),
            min: $.validator.format("请输入一个最小为 {0} 的值")
        });
    }(jQuery));
    //-------输入器---------------

    //
    $(".input-group-addon").off("click").on("click", function () {
        if (isDisabled) {
            return;
        }
        var $this = $(this);
        //var fields = $(this).data("fields");
        ////alert(fields);
        //var source = $(this).data("source");
        //var display = $(this).data("display");
        ////store-field
        var metaid = $(this).data("metadata-id");
        var iscancel = false;
        ////alert(display);
        //$(this).data("store-field","@@");
        //alert($(this).data("store-field"));
        //var apidata = fields + "||" + source + "||" + display;
        var apidata = metaid;
        var index = top.window.layer.open({
            type: 2,
            title: '<span style="font-size:14px;font-weight: bold;">窗体模式 - ' + "参照" + '<span>',
            closeBtn: 1,
            shadeClose: true,
            maxmin: true, //开启最大化最小化按钮
            area: ['860px', '500px'],
            content: '/BAPI/BAPI_ASHX_HTML.ashx?ticket=' + pub.State.Ticket + '&api=refname&type=string&data=' + apidata + '||R',
            //offset: [38, e.clientX - 245]
            cancel: function (index, layero) {
                //alert("cancel");
                localStorage.refname = "";
                iscancel = true;
                top.window.layer.close(index);
                return false;
            },
            close: function (index) {
                //alert("close");
                ////console.log(localStorage.refname);
                //$this.prev().val(localStorage.refname);
                //top.window.layer.close(index);
                return false;
            },
            end: function () {
                //alert("end");
                // console.log(localStorage.refname);
                //$this.val(localStorage.refname);
                if (!iscancel) {
                    $this.prev().val(localStorage.refname);
                }
                localStorage.refname = "";
                top.window.layer.close(index);
                return false;


            }
        });

        localStorage.layerindex = index; //用于关闭层

    });
    //-------------------------
    $("#button-control").off("click").on("click", function () {
        $('#searchresult').css("display", "none")
    })
    $("#button-control1").off("click").on("click", function () {
        $('#searchresult1').css("display", "none")
    })
    //-----------重置-------------------
    $("#btntable-reset").off("click").on("click", function () {
        $('#frmdata')[0].reset()
    })
    //----------初始化判断---------------




    


    $("#btntable-init").off("click").on("click", function () {
        if ($("#txtModuleType").val() == "")
            bmflag = 1;
        if ($("#txtModuleTypezhibiao").val() == "")
            zbflag = 1;
        if (bmflag == 0) {
            top.window.layer.msg('选择的部门不存在');
            return;
        };
        if (zbflag == 0) {
            top.window.layer.msg('选择的指标不存在');
            return;
        };
        if (!$("#txtModuleType").val() && !$("#txtModuleTypezhibiao").val()) {
            layer.msg('请选择部门或者指标！');
            return;
        };
        var data = $("#frmdata").serializeObject();
        
       // delete data['单据月'];
        console.log(data);
        FormInitData(data, "R", localStorage.mid);
        $('#btntable-init').attr("disabled", "disabled");

    });



    var isNew = false;
   
    //----------部门模糊查询start--------------------
    //----------save--------------------
    $("#btntable-save").off("click").on("click", function () {
        if ($("#txtModuleType").val() == "")
            bmflag = 1;
        if ($("#txtModuleTypezhibiao").val() == "")
            zbflag = 1;
        if (bmflag == 0) {
            top.window.layer.msg('选择的部门不存在');
            return;
        };
        if (zbflag == 0) {
            top.window.layer.msg('选择的指标不存在');
            return;
        };
        var id = $("#ID").val();
        var year = $("#year").val();
        var month = $("#month").val();
        var 部门ID = $("#部门ID").val();
        var 指标ID = $("#指标ID").val();
        var _kfalg;
        var message;
        var kdatajson = { "json": [id, "月度调整"] };
        var __str = JSON.stringify(kdatajson);
        if(id!="")
        {
            

           $.ajax({
                type: "POST",
                async: false,
                url: "/BAPI/BAPI_ASHX.ashx",
                data: { "api": "MC.YMJYGL.Server.YMJYGL.common.OperateDb.BAPI_验证_已调整的填报不能修改", "type": "json", "ticket": pub.State.Ticket, "data": __str },
                dataType: "Json",
                error: function (xhr, status, error) {
                    alert(error);
                },
                success: function (data) {
                    _kfalg = data.state;
                    message = data.json.Message;
                }
            }
            );
            if (_kfalg == "0") {
                layer.msg(message);
                return;
            }

           
            //--------------调整量+本月计划=调整结果-----------
            kdatajson = { "json": [id, $("#planmonth").val()] };
            __str = JSON.stringify(kdatajson);
            $.ajax({
                type: "POST",
                async: false,
                url: "/BAPI/BAPI_ASHX.ashx",
                data: { "api": "MC.YMJYGL.Server.YMJYGL.common.OperateDb.BAPI_修改_调整量", "type": "json", "ticket": pub.State.Ticket, "data": __str },
                dataType: "Json",
                error: function (xhr, status, error) {
                    alert(error);
                },
                success: function (data) {
                    _kfalg = data.state;
                    message = data.json.Message;
                }
            }
            );
            if (_kfalg == "0") {
                layer.msg(message);
                return;
            }
           
            //---------------下达过的单据不能编辑----------------
           // var wherejson = { "单据年": "" + year + "", "单据月": "" + month + "", "部门ID": "" + 部门ID + "", "指标ID": "" + 指标ID + "" };
            
            //localStorage.ydjhtbListQueryJson = JSON.stringify(wherejson)
            var __str = { "json": [{ "单据年": $("#year").val(), "单据月": $("#month").val(), "部门ID": $("#部门ID").val(), "指标ID": $("#指标ID").val() }] };
            var __str = JSON.stringify(__str);
            $.ajax({
                type: "POST",
                async: false,
                url: "/BAPI/BAPI_ASHX.ashx",
                data: { "api": "MC.YMJYGL.Server.YMJYGL.common.Select.BAPI_验证_单据是否下达", "type": "json", "ticket": pub.State.Ticket, "data": __str },
                dataType: "Json",
                error: function (xhr, status, error) {
                    alert(error);
                },
                success: function (data) {

                    _kfalg = data.state;
                    message = data.json.Message;
                }
            });
            if (_kfalg == "0") {
                layer.msg("单据已下达！不能被修改");
                return;
            }
            if (!$("#frmdata").valid()) {
                return false;
            }
           

        }
       
       
        var data = $("#frmdata").serializeObject(); //自动将form表单封装成json ,name属性
        delete data['本月自报'];
        //tablename 
        var table = $("#frmdata").attr("data-table");
        //alert(table);
        data["table"] = table;
        // alert($("input[name='ID']").val());
        if ($("input[name='ID']").val() == "") {
            isNew = true;
        }
        var json = JSON.stringify(data);
        

        if (localStorage.FormAction == "BC") {
            //批量

           
            var jjson = [];
             jjson = data;
             var jjson_json = [];
             var falg = 0;
            //删除
            delete data.值;
            var grid = mc_grid_dic["grid_1"];
            jjson.datas = grid.getData().getItems();
            var gridata = jjson.datas;

            for (var i = 0; i < gridata.length; i++) {
                console.log(gridata[i]);
                gridata[i].调整结果 = gridata[i].值;
            }
            jjson.delfields = ['版本号', '版本名称', 'FID', '是否默认', '当月自报', '当月计划', '本月自报', '本月计划',"指标编码"];
            var num;
            if (jjson.datas == "") {
                top.window.layer.msg("没有数据保存");
                return;
            }
            if (jjson.datas.length == 1) {
                for (var i = 0; i < jjson.datas.length; i++) {
                    var _object = jjson.datas[i];
                    num = _object.值;
                    //if (!_object.hasOwnProperty("调整结果")) {
                    //    _object["调整结果"] = num;
                    //}
                    if (!_object.hasOwnProperty("调整量")) {
                        _object["调整量"] = "0";
                    }
                    if (jjson.datas[i].值 != undefined && jjson.datas[i].值 != '') {
                        jjson_json.push(jjson.datas[i]);

                    }
                    else {
                        top.window.layer.msg("没有录入单据");
                        return;
                    }
                }

            }
            else {
                for (var i = 0; i < jjson.datas.length; i++) {

                    if (jjson.datas[i].值 != undefined && jjson.datas[i].值 != '') {
                        
                        jjson_json.push(jjson.datas[i]);

                    }
                    else {
                        ++falg;
                    }
                }
            }
            if (falg == jjson.datas.length) {
                top.window.layer.msg("没有录入单据");
                return;
            }
            jjson.datas = jjson_json;
            //console.log(JSON.stringify(jjson));
           FormAction(jjson, "BC", localStorage.mid);
            isNew = false;

        } else if (localStorage.FormAction == "M") {
            FormAction(data, "M", localStorage.mid);
        }
        else {

        }

    });
   

    //----------add--------------------
    $("#btntable-add").off("click").on("click", function () {
        //重置表单
        isNew = true;
        $('#frmdata')[0].reset();

    });

    //--------------------------------------
    $("#btntable-edit").off("click").on("click", function () {
        localStorage.FormMode = "Edit";
        //修改标题
        top.window.layer.title("窗口模式 - 编辑");
        $('input').removeAttr("readonly");
        $('input').removeAttr("disabled");
        $('select').removeAttr("disabled");
        $('button').removeAttr("disabled");
        isDisabled = false; //禁用输入器
    });
   



    $(function () {

        $("#txtModuleType").keyup(function (evt) {
            var arrid = [];
            console.log(arrid);
            ChangeCoords(); //控制查询结果div坐标    
            var k = window.event ? evt.keyCode : evt.which;
            //输入框的id为txt_search，这里监听输入框的keyup事件    
            //不为空 && 不为上箭头或下箭头或回车    
            var json = { "json": [$("#txtModuleType").val(), ""] };
            var __str = JSON.stringify(json);

            bmflag = 0;
            if ($("#txtModuleType").val() != "" && k != 38 && k != 40 && k != 13) {

                $.ajax({
                    type: 'POST',
                    async: true, //同步执行，不然会有问题    
                    dataType: "Json",
                    url: "/BAPI/BAPI_ASHX.ashx",   //提交的页面/方法名    
                    data: { "api": "MC.YMJYGL.Server.YMJYGL.common.Select.BAPI_模糊查询_部门名称", "type": "json", "ticket": pub.State.Ticket, "data": __str },

                    error: function (msg) {//请求失败处理函数    
                        alert("数据加载失败");
                    },
                    success: function (data) { //请求成功后处理函数。    
                        /*  var objData = eval("(" + data.userName + ")");   */
                        console.log(data);
                        console.log(data.json.Data.dtList)

                        if (data.json.Data.dtList.length > 0) {
                           
                            layer = "<table id='worktb'>";
                            $.each(data.json.Data.dtList, function (idx, item) {
                                console.log(item);
                                var id = item.部门ID;
                                arrid.push(id);

                                layer += "<tr class='line'><td class='std'>" + item.名称 + "</td></tr>";

                            });
                            layer += "</table>";

                            //将结果添加到div中        
                            $("#searchresult").empty();
                            $("#searchresult").append(layer);
                            $(".line:first").addClass("hover");
                            $("#searchresult").css("display", "");
                            //鼠标移动事件    


                            $(".line").hover(function () {
                                bmflag = 1;
                                $(".line").removeClass("hover");
                                $(this).addClass("hover");
                                var width = $("#txtModuleType").width() + 25;
                                $(".hover").css("width", width + "px");
                                $(".std").css("width", width + "px");

                                var index = $(this).index();
                                console.log(index);
                                console.log(arrid[index]);
                                $('input[name="部门ID"]').val(arrid[index]);
                                $("#txtModuleType").val($(this).text());
                            }, function () {
                                $(this).removeClass("hover");
                                //$("#searchresult").css("display", "none");    
                            });
                            //鼠标点击事件    
                            $(".line").click(function () {
                                bmflag = 1;
                                var index = $(this).index();
                                console.log(index);
                                console.log(arrid[index]);
                                $('input[name="部门ID"]').val(arrid[index]);
                                $("#txtModuleType").val($(this).text());

                                $("#searchresult").css("display", "none");
                            });


                        } else {
                            bmflag = 0;
                            $("#searchresult").empty();
                            $("#searchresult").css("display", "none");

                        }
                    }
                });
            }
        });
    });
    //设置查询结果div坐标    

    function ChangeCoords() {
        //    var left = $("#txt_search")[0].offsetLeft; //获取距离最左端的距离，像素，整型    
        //    var top = $("#txt_search")[0].offsetTop + 26; //获取距离最顶端的距离，像素，整型（20为搜索输入框的高度）    
        var left = $("#txtModuleType").position().left; //获取距离最左端的距离，像素，整型    
        var top = $("#txtModuleType").position().top + 36;; //获取距离最顶端的距离，像素，整型（20为搜索输入框的高度）   
        var width = $("#txtModuleType").width() + 25;
        $("#searchresult").css("left", left + "px"); //重新定义CSS属性    
        $("#searchresult").css("top", top + "px"); //同上
        $("#searchresult").css("width", width + "px"); //同上


    }
    //指标模糊查询
    $(function () {

        $("#txtModuleTypezhibiao").keyup(function (evt) {
            var arrid = [];
            console.log(arrid);
            ChangeCoords(); //控制查询结果div坐标    
            var k = window.event ? evt.keyCode : evt.which;
            //输入框的id为txt_search，这里监听输入框的keyup事件    
            //不为空 && 不为上箭头或下箭头或回车    
            var json = { "json": [$("#txtModuleTypezhibiao").val(), ""] };
            var __str = JSON.stringify(json);

            zbflag = 0;
            if ($("#txtModuleTypezhibiao").val() != "" && k != 38 && k != 40 && k != 13) {

                $.ajax({
                    type: 'POST',
                    async: true, //同步执行，不然会有问题    
                    dataType: "Json",
                    url: "/BAPI/BAPI_ASHX.ashx",   //提交的页面/方法名    
                    data: { "api": "MC.YMJYGL.Server.YMJYGL.common.Select.BAPI_模糊查询_指标名称计划填报", "type": "json", "ticket": pub.State.Ticket, "data": __str },

                    error: function (msg) {//请求失败处理函数    
                        alert("数据加载失败");
                    },
                    success: function (data) { //请求成功后处理函数。    
                        /*  var objData = eval("(" + data.userName + ")");   */
                        console.log(data);
                        console.log(data.json.Data.dtList)

                        if (data.json.Data.dtList.length > 0) {
                            
                            layer = "<table id='worktb1'>";
                            $.each(data.json.Data.dtList, function (idx, item) {
                                console.log(item);
                                var id = item.指标ID;
                                arrid.push(id);

                                layer += "<tr class='line'><td class='std'>" + item.名称 + "</td></tr>";

                            });
                            layer += "</table>";

                            //将结果添加到div中        
                            $("#searchresult1").empty();
                            $("#searchresult1").append(layer);
                            $(".line1:first").addClass("hover");
                            $("#searchresult1").css("display", "");
                            //鼠标移动事件    


                            $(".line").hover(function () {
                                zbflag = 1;
                                $(".line").removeClass("hover");
                                $(this).addClass("hover");
                                var width = $("#txtModuleTypezhibiao").width() + 25;
                                $(".hover").css("width", width + "px");
                                $(".std").css("width", width + "px");

                                var index = $(this).index();
                                console.log(index);
                                console.log(arrid[index]);
                                $('input[name="指标ID"]').val(arrid[index]);
                                $("#txtModuleTypezhibiao").val($(this).text());
                            }, function () {
                                $(this).removeClass("hover");
                                //$("#searchresult").css("display", "none");    
                            });
                            //鼠标点击事件    
                            $(".line").click(function () {
                                zbflag = 1;
                                var index = $(this).index();
                                console.log(index);
                                console.log(arrid);
                                $('input[name="指标ID"]').val(arrid[index]);
                                $("#txtModuleTypezhibiao").val($(this).text());

                                $("#searchresult1").css("display", "none");
                            });


                        } else {
                            zbflag = 0;
                            $("#searchresult1").empty();
                            $("#searchresult1").css("display", "none");

                        }
                    }
                });
            }
        });
    });
    //设置查询结果div坐标    

    function ChangeCoords() {
        //    var left = $("#txt_search")[0].offsetLeft; //获取距离最左端的距离，像素，整型    
        //    var top = $("#txt_search")[0].offsetTop + 26; //获取距离最顶端的距离，像素，整型（20为搜索输入框的高度）    
        var left = $("#txtModuleTypezhibiao").position().left; //获取距离最左端的距离，像素，整型    
        var top = $("#txtModuleTypezhibiao").position().top + 36;; //获取距离最顶端的距离，像素，整型（20为搜索输入框的高度）   
        var width = $("#txtModuleTypezhibiao").width() + 25;
        $("#searchresult1").css("left", left + "px"); //重新定义CSS属性    
        $("#searchresult1").css("top", top + "px"); //同上
        $("#searchresult1").css("width", width + "px"); //同上


    }
    //////////////////////////////////////////
    //下拉列表绑定
    function BindSelector(selector, api) {
        // C M D
        var json = { "json": ['', 'R'] };
        var __str = JSON.stringify(json);
        $.ajax({
            type: "POST",
            url: "/BAPI/BAPI_ASHX.ashx",
            data: { "api": api, "type": "json", "ticket": pub.State.Ticket, "data": __str },
            dataType: "Json",
            error: function (xhr, status, error) {
                alert(error);
            },
            success: function (data) {

                if (data.state == "1") {
                    //console.log(data.json.Data.dt)
                    //填充列表
                    $.each(data.json.Data.dt, function (i, item) {

                        $(selector).append("<option value='" + item.ID + "'>" + item["名称"] + "</option>");

                    });

                } else {


                }
            }

        });
    }
    //-----------窗体增删改查事件--------------------
    function FormAction(data, action, mid) {
        //R C M D
        //alert();
        delete data['是否查询部门下级'];
        delete data['本月自报'];
        var json = { "json": [data, action, mid] };
        var __str = JSON.stringify(json);
        
        $.ajax({
            type: "POST",
            url: "/BAPI/BAPI_ASHX.ashx",
            data: { "api": "MC.YMJYGL.Server.YMJYGL.common.OperateDb.BAPI_新增_单表批量", "type": "json", "ticket": pub.State.Ticket, "data": __str },
            dataType: "Json",
            error: function (xhr, status, error) {
                alert(error);
            },
            success: function (data) {
                console.log(data.json.Data);
                if (data.state == "1") {
                    if (action == "R") {
                        console.log(data.json.Data.dt[0]);
                        $("#ID").val(data.json.Data.dt[0].ID);
                        $("#frmdata").fill(data.json.Data.dt[0], { styleElementName: 'none' });
                        $("#指标ID").val(data.json.Data.dt[0].指标ID);
                        $("#部门ID").val(data.json.Data.dt[0].部门ID);
                        // alert($("#ID").val());


                    } else if (action == "D" || action == "C") {
                        //删除关闭
                        top.window.layer.close(localStorage.layerindex);

                    } else {
                        top.window.layer.msg("操作成功");
                    }
                } else {
                    if (data.json.Message != "") {
                        //后台提示
                        top.window.layer.msg(data.json.Message);
                    } else {
                        top.window.layer.msg("操作失败");
                    }
                    // top.window.layer.msg("操作失败");

                }
            }

        });
    }

    function FormInitData(data, action, mid) {
        //R C M D\
        var strdata = JSON.stringify(data);
        var json = { "json": [strdata, action, mid] };
        var __str = JSON.stringify(json);
        $.ajax({
            type: "POST",
            url: "/BAPI/BAPI_ASHX.ashx",
            data: { "api": "MC.YMJYGL.Server.YMJYGL.common.OperateDb.BAPI_数据初始化", "type": "json", "ticket": pub.State.Ticket, "data": __str },
            dataType: "Json",
            error: function (xhr, status, error) {
                alert(error);
            },
            success: function (data) {
                console.log(data.json.Data);
                if (data.state == "1") {
                    //bind data
                    // grid = data.json.Data.dt;
                    var grid = mc_grid_dic["grid_1"];

                    if (data.json.Data.dt.length != "") {

                        localStorage.id = 1;
                        if (localStorage.id == 1) {

                            var month = $('#month').val();
                            for (var i = 0; i < data.json.Data.dt.length; i++) {
                                data.json.Data.dt[i].单据月 = month;
                            }
                            grid.getData().setItems(data.json.Data.dt);

                        }
                        $("#month").on("change", function () {
                            localStorage.id = "";
                            var month = $('#month').val();

                            ///////
                           //////

                            for (var i = 0; i < data.json.Data.dt.length; i++) {
                                data.json.Data.dt[i].单据月 = month;
                            }

                            grid.invalidateAllRows();
                            grid.render();

                            grid.getData().setItems(data.json.Data.dt);
                            console.log(data.json.Data.dt);

                            //alert(localStorage.id);
                        });


                    }
                    else {
                        top.window.layer.msg('没有数据');
                        return;
                    }

                } else {
                    if (data.json.Message != "") {
                        //后台提示
                        top.window.layer.msg(data.json.Message);
                    } else {
                        top.window.layer.msg("操作失败");
                    }

                }
            }

        });
    }
    
    

    //----------删除判断----------------
    $('#btntable-delete').off("click").on("click", function () {
        var id = $("#ID").val();
        var _kfalg;
        var message;
        var kdatajson = { "json": [id,"月度调整"] };
        var __str = JSON.stringify(kdatajson);
        $.ajax({
            type: "POST",
            async: false,
            url: "/BAPI/BAPI_ASHX.ashx",
            data: { "api": "MC.YMJYGL.Server.YMJYGL.common.OperateDb.BAPI_验证_已调整的填报不能修改", "type": "json", "ticket": pub.State.Ticket, "data": __str },
            dataType: "Json",
            error: function (xhr, status, error) {
                alert(error);
            },
            success: function (data) {
                _kfalg = data.state;
                message = data.json.Message;
            }
        }
        );
        //alert(_kfalg);
        if (_kfalg == "0") {
            layer.msg(message);
            return;
        }
      //---------------已下达的不能删除-------------------
        var __str = { "json": [{ "单据年": $("#year").val(), "单据月": $("#month").val(), "部门ID": $("#部门ID").val(), "指标ID": $("#指标ID").val() }] };
        
        var __str = JSON.stringify(__str);
        $.ajax({
            type: "POST",
            async: false,
            url: "/BAPI/BAPI_ASHX.ashx",
            data: { "api": "MC.YMJYGL.Server.YMJYGL.common.Select.BAPI_验证_单据是否下达", "type": "json", "ticket": pub.State.Ticket, "data": __str },
            dataType: "Json",
            error: function (xhr, status, error) {
                alert(error);
            },
            success: function (data) {

                _kfalg = data.state;
                message = data.json.Message;
            }
        });
        if (_kfalg == "0") {
            layer.msg("单据已下达！不能被删除");
            return;
        }
        if (!$("#frmdata").valid()) {
            return false;
        }
       
        ///////////////////////////////////////////
        FormAction(localStorage.BillId, "D", localStorage.mid);
        top.window.layer.close(localStorage.layerindex);

    });
    //--------------编辑保存判断------------
    
    //$('#btntable-save').off("click").on("click", function () {
    //    alert();
    //    var id = $("#ID").val();
    //    //var bumen = $("input[name=部门ID]").val();
    //    //var zhibiao = $("input[name=指标ID]").val();
    //    ////////////////////////////////////////////
    //    var _kfalg;
    //    var message;
    //    var kdatajson = { "json": [id, "月度调整"] };
    //    var __str = JSON.stringify(kdatajson);
    //    $.ajax({
    //        type: "POST",
    //        async: false,
    //        url: "/BAPI/BAPI_ASHX.ashx",
    //        data: { "api": "MC.YMJYGL.Server.YMJYGL.common.OperateDb.BAPI_验证_已调整的填报不能修改", "type": "json", "ticket": pub.State.Ticket, "data": __str },
    //        dataType: "Json",
    //        error: function (xhr, status, error) {
    //            alert(error);
    //        },
    //        success: function (data) {
    //            _kfalg = data.state;
    //            message = data.json.Message;
    //        }
    //    }
    //    );
    //    //alert(_kfalg);
    //    if (_kfalg == "0") {
    //        layer.msg(message);
    //        return;
    //    }

    //    ///////////////////////////////////////////
    //    FormAction(localStorage.BillId, "M", localStorage.mid);
    //    top.window.layer.close(localStorage.layerindex);

    //});
    ////监听
    //(function () {
    //    var formYear = document.getElementById("year");
    //    var month = document.getElementById("month");
    //    formYear.addEventListener('change', chongzhibiao);
    //    month.addEventListener('change', chongzhibiao);
    //})()
    //--------------
    $('input').attr("readonly", "readonly");
    $('button').attr("disabled", "disabled");

    // localStorage.FormMode = "Add";//test
    //数据初始化 test
    // FormInitData({ "单据年": 2017, "单据月": 1, "单据类型": "年度计划", "是否查询部门下级": 0, "部门ID": "", "指标ID": "", }, "I", localStorage.mid);



    if (localStorage.FormMode != "Add") {

        //解决这个固定模块ID获取
        //点击菜单进行赋值
        FormAction(localStorage.BillId, "R", localStorage.mid);
        //if (localStorage.FormMode != "Edit") {
        //    $('input').attr("readonly", "readonly");
        //    //$('input').removeAttr("readonly");
        //    //$('input').attr("disabled", "disabled")//将input元素设置为disabled  
        //    //$('input').removeAttr("disabled");//去除input元素的disabled属性
        //    //button
        //    $('button').attr("disabled", "disabled");
        //    //$('#btnsave').removeAttr("disabled");
        //}





    }
    if (localStorage.FormMode == "View") {
        $("#btntable-reset").css('display', 'none');
        //$('input').attr("readonly", "readonly");//checkbox无效
        $('input').attr("disabled", "disabled"); //checkbox
        $('button').attr("disabled", "disabled");
        $('select').attr("disabled", "disabled");
        $("#tab_1").css('display', 'none');
        $("#myTab").css('display', 'none');
        $("#btntable-import").css('display', 'none');
        $("#exel").css('display', 'none');
        //slickgrid readonly
        $(".detail-table").each(function (i, item) {
            var grid = mc_grid_dic[$(item).attr("id")]
            grid.setOptions({ editable: false });
        });
        //$('.input-group-addon').attr("disabled", "disabled");
        //$(".input-group-addon").css('display', 'none');//输入器 不对齐
        //$(".input-group-addon").css('visibility', 'hidden');//输入器 
        isDisabled = true; //禁用输入器 
    }
    if (localStorage.FormMode == "Add") {
        $("#exel").css('display', 'none');
        $('#benyuejihua').css("display", "none");
        $('#myre').css("display", "none");
        $('input').removeAttr("readonly");
        $('input').removeAttr("disabled");
        $('select').removeAttr("disabled");
        $('button').removeAttr("disabled");
        $("#gr1").css('display', 'none');
        $("#gr2").css('display', 'none');
       
        $("#btn-group").css('display', 'none');
        $("#Div2").css('display', 'none');
        $("#btntable-edit").css('display', 'none');
        $("#btntable-delete").css('display', 'none');
        $("#btntable-go").css('display', 'none');
        $("#btntable-search").css('display', 'none');
        $("#btntable-import").css('display', 'none');
        //$(".input-group-addon").css('visibility', 'visible');//输入器 
        isDisabled = false; //禁用输入器
    }
    if (localStorage.FormMode == "Import") {
        $('#zhaungtai').css("display", "none");
        $('#importblock').css("display", "none");

        $("#btntable-init").css('display', 'none');
        $("#btntable-save").css('display', 'none');
        $("#tntable_search_list").css('display', 'none');
       // $('#month').css("display", "none");
        //$('#txtModuleType').css("display", "none");
        //$('#input_group_btn_bumen').css("display", "none");
        //$('#namme').css("display", "none");
        $('#zhaungtai').css("display", "none");
        $('#myre').css("display", "none");
        $('input').removeAttr("readonly");
        $('input').removeAttr("disabled");
        $('select').removeAttr("disabled");
        $('button').removeAttr("disabled");
        $("#gr1").css('display', 'none');
        $("#gr2").css('display', 'none');
        $('#txtModuleType').attr("readonly", "readonly");
        $('#txtModuleTypezhibiao').attr("readonly", "readonly");
        $("#btn-group").css('display', 'none');
        $("#Div2").css('display', 'none');
        $("#btntable-edit").css('display', 'none');
        $("#btntable-delete").css('display', 'none');
        $("#btntable-go").css('display', 'none');
        $("#btntable-search").css('display', 'none');
        
        //$(".input-group-addon").css('visibility', 'visible');//输入器 
        isDisabled = false; //禁用输入器
    }
    //if (localStorage.FormMode == "Query") {
    //    $('input').removeAttr("readonly");
    //    $('input').removeAttr("disabled");
    //    $('select').removeAttr("disabled");
    //    $('button').removeAttr("disabled");
    //    $("#gr1").css('display', 'none');
    //    $("#gr2").css('display', 'none');
    //    $("#tab_1").css('display', 'none');
    //    $("#myTab").css('display', 'none');
    //    $("#myTabContent").css('display', 'none');
    //    isDisabled = false; //禁用输入器
    //}
    if (localStorage.FormMode == "Edit") {
        $("#exel").css('display', 'none');
        $('#Text1').removeAttr("disabled");
        $('#Text1').removeAttr("readonly");
        $('#mymonths').removeAttr("disabled");
        $('#mymonths').removeAttr("readonly");
        $('#btntable-save').removeAttr("disabled");
        $("#year").attr("disabled", "disabled");
        $("#month").attr("disabled", "disabled");
       
        $("#txtModuleType_btn_btn").attr("disabled", "disabled");
        $("#btn_group_bumen").attr("disabled", "disabled");
        $("#btntable-import").css('display', 'none');
        $("#btntable-reset").css('display', 'none');
        $("#btntable-edit").css('display', 'none');
        $("#btntable-delete").css('display', 'none');
        //$("#btntable-go").css('display', 'none');
        $("#btntable-search").css('display', 'none');
        //$('input').removeAttr("readonly");
        //$('input').removeAttr("disabled");
        //$('select').removeAttr("disabled");
        //$('button').removeAttr("disabled");
        isDisabled = false; //禁用输入器
        $("#tab_1").css('display', 'none');
        $("#myTab").css('display', 'none');
        $("#grid_1").css('display', 'none');
        $("#btntable-init").css('display', 'none');
        $("#myTab").css('display', 'none');
        $("#myTabContent").css('display', 'none');
        $('#txtModuleType').removeAttr("readonly", "readonly");
        $('#txtModuleTypezhibiao').removeAttr("readonly", "readonly");
        $('#shenhezhuangtai').attr("readonly", "readonly");
        $('#planmonth').removeAttr("readonly", "readonly");
        $('#planmonth').removeAttr("disabled", "disabled");
        //$(".input-group-addon").css('visibility', 'visible');//输入器 
        $(".detail-table").each(function (i, item) {

            var grid = mc_grid_dic[$(item).attr("id")]
            grid.setOptions({ editable: true });
        })
    }
    if (localStorage.FormMode == "Delete") {
        $("#exel").css('display', 'none');
        $("#btntable-reset").css('display', 'none');
        //  alert(localStorage.BillId);
        $('input').attr("disabled", "disabled"); //checkbox
        $('button').attr("disabled", "disabled");
        $('select').attr("disabled", "disabled");
        $("#tab_1").css('display', 'none');
        $("#myTab").css('display', 'none');
        $("#btntable-import").css('display', 'none');
        $('#btntable-delete').removeAttr("disabled");
        isDisabled = true; //禁用输入器
        //$(".input-group-addon").css('display', 'none');
        //$(".input-group-addon").css('visibility', 'visible');//输入器 
    }


    //WF----工作流提交-----------
    $("#btntable-go").off("click").on("click", function () {

        var billid = $('input[name="ID"]').val();
        var mid = localStorage.mid;
        wfAction(mid, billid);
    });
    //WF----工作流退回（一退到底）-----------
    $("#btntable-back").off("click").on("click", function () {

        var billid = $('input[name="ID"]').val();
        var mid = localStorage.mid;
        wfBackAction(mid, billid);
    });

    //WF----工作流后台服务，工作流集成-----------
    function wfAction(mid, billid) {
        var json = { "json": [mid, billid] };
        var __str = JSON.stringify(json);
        $.ajax({
            type: "POST",
            url: "/BAPI/BAPI_ASHX.ashx",
            data: { "api": "MC.Server.Module.WFManager.BAPI_工作流_提交", "type": "json", "ticket": pub.State.Ticket, "data": __str },
            dataType: "Json",
            error: function (xhr, status, error) {
                alert(error);
            },
            success: function (data) {
                //console.log(data.json);
                if (data.state == "1") {
                    top.window.layer.msg("操作成功");

                } else {
                    if (data.json.Message != "") {
                        //后台提示
                        top.window.layer.msg(data.json.Message);
                    } else {
                        top.window.layer.msg("操作失败");
                    }


                }
            }

        });
    }
    //WF----工作流后台服务，工作流集成-----------
    function wfBackAction(mid, billid) {
        var json = { "json": [mid, billid] };
        var __str = JSON.stringify(json);
        $.ajax({
            type: "POST",
            url: "/BAPI/BAPI_ASHX.ashx",
            data: { "api": "MC.Server.Module.WFManager.BAPI_工作流_退回", "type": "json", "ticket": pub.State.Ticket, "data": __str },
            dataType: "Json",
            error: function (xhr, status, error) {
                alert(error);
            },
            success: function (data) {
                console.log(data.json);
                if (data.state == "1") {
                    top.window.layer.msg("操作成功");

                } else {
                    if (data.json.Message != "") {
                        //后台提示
                        top.window.layer.msg(data.json.Message);
                    } else {
                        top.window.layer.msg("操作失败");
                    }

                }
            }

        });
    }
    //---------------------
});