$(document).ready(function () {
    //---------------------------
    bmflag = 1;
    zbflag = 1;
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
    //----------部门模糊查询end--------------------
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
                            $("#searchresultbm").empty();
                            $("#searchresultbm").append(layer);
                            $(".line:first").addClass("hover");
                            $("#searchresultbm").css("display", "");
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
                                //$("#searchresultbm").css("display", "none");    
                            });
                            //鼠标点击事件    
                            $(".line").click(function () {
                                bmflag = 1;
                                var index = $(this).index();
                                console.log(index);
                                console.log(arrid[index]);
                                $('input[name="部门ID"]').val(arrid[index]);
                                $("#txtModuleType").val($(this).text());

                                $("#searchresultbm").css("display", "none");
                            });
                        } else {
                            bmflag = 0;
                            $("#searchresultbm").empty();
                            $("#searchresultbm").css("display", "none");

                        }
                    }
                });
            }
            //else if (k == 38) {//上箭头    
            //    $('#worktb tr.hover').prev().addClass("hover");
            //    $('#worktb tr.hover').next().removeClass("hover");
            //    var index = $('#worktb tr.hover').index();
            //    console.log(arrid[index]);
            //    $('input[name="部门ID"]').val(arrid[index]);
            //    $('#txtModuleType').val($('#worktb tr.hover').text());
            //} else if (k == 40) {//下箭头    
            //    $('#worktb tr.hover').next().addClass("hover");
            //    $('#worktb tr.hover').prev().removeClass("hover");
            //    var index = $('#worktb tr.hover').index();
            //    console.log(localStorage.Arry);
            //    $('input[name="部门ID"]').val(arrid[index]);
            //    $('#txtModuleType').val($('#worktb tr.hover').text());
            //}
            //else if (k == 13) {//回车   
                
            //    var index = $('#worktb tr.hover').index();
            //    console.log(arrid[index]);
            //    $('#txtModuleType').val($('#worktb tr.hover').text());
            //    $('input[name="部门ID"]').val(arrid[index]);
            //    $("#searchresult").empty();
            //    $("#searchresult").css("display", "none");
            //}
            else {
                $("#searchresult").empty();
                $("#searchresult").css("display", "none");
            }
        });
        $("#searchresultbm").on("mouseleave", function () {
            $("#searchresultbm").empty();
            $("#searchresultbm").css("display", "none");
        });
    });
    //设置查询结果div坐标    

    function ChangeCoords() {
        //    var left = $("#txt_search")[0].offsetLeft; //获取距离最左端的距离，像素，整型    
        //    var top = $("#txt_search")[0].offsetTop + 26; //获取距离最顶端的距离，像素，整型（20为搜索输入框的高度）    
        var left = $("#txtModuleType").position().left; //获取距离最左端的距离，像素，整型    
        var top = $("#txtModuleType").position().top + 36;; //获取距离最顶端的距离，像素，整型（20为搜索输入框的高度）   
        var width = $("#txtModuleType").width() + 25;
        $("#searchresultbm").css("left", left + "px"); //重新定义CSS属性    
        $("#searchresultbm").css("top", top + "px"); //同上
        $("#searchresultbm").css("width", width + "px"); //同上


    }
    

    //----------指标模糊查询start--------------------
    
    $(function () {
        $("#txtzbmc").keyup(function (evt) {
            var arrid = [];
            console.log(arrid);
            ChangeCoords(); //控制查询结果div坐标    
            var k = window.event ? evt.keyCode : evt.which;
            //输入框的id为txt_search，这里监听输入框的keyup事件    
            //不为空 && 不为上箭头或下箭头或回车    
            var json = { "json": [$("#txtzbmc").val(), ""] };
            var __str = JSON.stringify(json);

            zbflag = 0;
            if ($("#txtzbmc").val() != "" && k != 38 && k != 40 && k != 13) {

                $.ajax({
                    type: 'POST',
                    async: true, //同步执行，不然会有问题    
                    dataType: "Json",
                    url: "/BAPI/BAPI_ASHX.ashx",   //提交的页面/方法名    
                    data: { "api": "MC.YMJYGL.Server.YMJYGL.common.Select.BAPI_模糊查询_指标名称", "type": "json", "ticket": pub.State.Ticket, "data": __str },

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
                                var id = item.指标ID;
                                arrid.push(id);

                                layer += "<tr class='line'><td class='std'>" + item.名称 + "</td></tr>";

                            });
                            layer += "</table>";

                            //将结果添加到div中        
                            $("#searchresultzb").empty();
                            $("#searchresultzb").append(layer);
                            $(".line:first").addClass("hover");
                            $("#searchresultzb").css("display", "");
                            //鼠标移动事件    


                            $(".line").hover(function () {
                                zbflag = 1;
                                $(".line").removeClass("hover");
                                $(this).addClass("hover");
                                var width = $("#txtzbmc").width() + 25;
                                $(".hover").css("width", width + "px");
                                $(".std").css("width", width + "px");

                                var index = $(this).index();
                                console.log(index);
                                console.log(arrid[index]);
                                $('input[name="指标ID"]').val(arrid[index]);
                                $("#txtzbmc").val($(this).text());
                            }, function () {
                                $(this).removeClass("hover");
                                //$("#searchresultzb").css("display", "none");    
                            });
                            //鼠标点击事件    
                            $(".line").click(function () {
                                zbflag = 1;
                                var index = $(this).index();
                                console.log(index);
                                console.log(arrid[index]);
                                $('input[name="指标ID"]').val(arrid[index]);
                                $("#txtzbmc").val($(this).text());

                                $("#searchresultzb").css("display", "none");
                            });


                        } else {
                            zbflag = 0;
                            $("#searchresultzb").empty();
                            $("#searchresultzb").css("display", "none");

                        }
                    }
                });
            }
            //else if (k == 38) {//上箭头    
            //    $('#worktb tr.hover').prev().addClass("hover");
            //    $('#worktb tr.hover').next().removeClass("hover");
            //    var index = $('#worktb tr.hover').index();
            //    console.log(arrid[index]);
            //    $('input[name="指标ID"]').val(arrid[index]);
            //    $('#txtzbmc').val($('#worktb tr.hover').text());
            //} else if (k == 40) {//下箭头    
            //    $('#worktb tr.hover').next().addClass("hover");
            //    $('#worktb tr.hover').prev().removeClass("hover");
            //    var index = $('#worktb tr.hover').index();
            //    console.log(localStorage.Arry);
            //    $('input[name="指标ID"]').val(arrid[index]);
            //    $('#txtzbmc').val($('#worktb tr.hover').text());
            //}
            //else if (k == 13) {//回车   
            //    localStorage.Arry = '';
            //    var index = $('#worktb tr.hover').index();
            //    console.log(arrid[index]);
            //    $('#txtzbmc').val($('#worktb tr.hover').text());
            //    $('input[name="指标ID"]').val(arrid[index]);
            //    $("#searchresultzb").empty();
            //    $("#searchresultzb").css("display", "none");
            //}
            else {
                $("#searchresultzb").empty();
                $("#searchresultzb").css("display", "none");
            }
        });
        $("#searchresultzb").on("mouseleave", function () {
            $("#searchresultzb").empty();
            $("#searchresultzb").css("display", "none");
        });
    });
    //设置查询结果div坐标    

    function ChangeCoords() {
        //    var left = $("#txt_search")[0].offsetLeft; //获取距离最左端的距离，像素，整型    
        //    var top = $("#txt_search")[0].offsetTop + 26; //获取距离最顶端的距离，像素，整型（20为搜索输入框的高度）    
        var left = $("#txtzbmc").position().left; //获取距离最左端的距离，像素，整型    
        var top = $("#txtzbmc").position().top + 36;; //获取距离最顶端的距离，像素，整型（20为搜索输入框的高度）   
        var width = $("#txtzbmc").width() + 25;
        $("#searchresultzb").css("left", left + "px"); //重新定义CSS属性    
        $("#searchresultzb").css("top", top + "px"); //同上
        $("#searchresultzb").css("width", width + "px"); //同上


    }
    //----------指标模糊查询end--------------------
    //
    $(".input-group-addon").off("click").on("click", function () {
        if (isDisabled) {
            return;
        }
        var $this = $(this);
        //var fields = $(this).data("fields");
        //var source = $(this).data("source");
        //var display = $(this).data("display");
        ////store-field
        var metaid = $(this).data("metadata-id");
        var iscancel = false;
        //$(this).data("store-field","@@");
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
                localStorage.refname = "";
                iscancel = true;
                top.window.layer.close(index);
                return false;
            },
            close: function (index) {
                ////console.log(localStorage.refname);
                //$this.prev().val(localStorage.refname);
                //top.window.layer.close(index);
                return false;
            },
            end: function () {
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
    var isNew = false;
    //----------delete--------------------
    $("#btntable-delete").off("click").on("click", function () {
        ////////////////////////////////////////////
        var _kfalg;
        var message;
        var kdatajson = "{\"json\":[\"" + $("#form_year").val() + "\",\"" + $("#form_month").val() + "\",\"P\",\"\"]}"
        $.ajax({
            type: "POST",
            async: false,
            url: "/BAPI/BAPI_ASHX.ashx",
            data: { "api": "MC.YMJYGL.Server.YMJYGL.assessmentMange.Monthly.BAPI_查询_是否月结", "type": "json", "ticket": pub.State.Ticket, "data": kdatajson },
            dataType: "Json",
            error: function (xhr, status, error) {
                alert(error);
            },
            success: function (data) {
                _kfalg = data.json.State;
                message = data.json.Message;
            }
        }
        );
        if (!parseInt(_kfalg)) {
            layer.msg(message);
            return;
        }
        ///////////////////////////////////////////
        FormAction1(localStorage.BillId, "D", localStorage.mid);
        top.window.layer.close(localStorage.layerindex);
        //如何关闭
    });
    //----------chongzhi----------//
    $("#btntable-chongzhi").off("click").on("click", function () {
        //重置表单

        $('#frmdata')[0].reset();
        localStorage.lastyear = "";
        localStorage.lastmoon = "";
        localStorage.lastbm = "";
        localStorage.lastbmmc = "";
        localStorage.lastzb = "";
        localStorage.lastzbmc = "";
    });
    //----------search----------//
    $('#btntable-search').off("click").on("click", function () {
        if (!$("#txtModuleType").val() && !$("#txtzbmc").val()) {
            layer.msg('请选择部门或指标！');
            return;
        };
        if ($("#txtModuleType").val() == "")
            
            bmflag = 1;
        if ($("#txtzbmc").val() == "")
            
            zbflag = 1;
        if (bmflag == 0) {
            top.window.layer.msg('选择的部门不存在');
            return;
        };
        if (zbflag == 0) {
            top.window.layer.msg('选择的指标不存在');
            return;
        };
        var data = $("#frmdata").serializeObject();  //获取form 所有数据转换json数据
        ////////////////////////////////////////////
        var _kfalg;
        var message;
        var kdatajson = "{\"json\":[\"" + $("#form_year").val() + "\",\"" + $("#form_month").val() + "\",\"P\",\"\"]}"
        $.ajax({
            type: "POST",
            async: false,
            url: "/BAPI/BAPI_ASHX.ashx",
            data: { "api": "MC.YMJYGL.Server.YMJYGL.assessmentMange.Monthly.BAPI_查询_是否月结", "type": "json", "ticket": pub.State.Ticket, "data": kdatajson },
            dataType: "Json",
            error: function (xhr, status, error) {
                alert(error);
            },
            success: function (data) {
                _kfalg = data.json.State;
                message = data.json.Message;
            }
        }
        );
        if (!parseInt(_kfalg)) {
            top.window.layer.msg(message);
            return;
        }
        
        ///////////////////////////////////////////
        var data = $("#frmdata").serializeObject();
        var nulldata;
        var json = { "json": [data, "C", localStorage.mid] };
        var __str = JSON.stringify(json);
        $.ajax({
            type: "POST",
            async: false,
            url: "/BAPI/BAPI_ASHX.ashx",
            data: { "api": "MC.YMJYGL.Server.YMJYGL.common.OperateDb.BAPI_数据初始化", "type": "json", "ticket": pub.State.Ticket, "data": __str },
            dataType: "Json",
            error: function (xhr, status, error) {
                alert(error);
            },
            success: function (data) {
                nulldata = !data.json.Data.dt.length
            }
        });
        if (nulldata) {
            top.window.layer.msg('没有数据！')
            return;
        }
        $('#btntable-save').removeAttr("disabled", "disabled");
        FormAction(data, "R", localStorage.mid);

    });

    //-----btntable-search-list -----///

    $('#btntable-search-list').off("click").on("click", function () {

        var data = $("#frmdata").serializeObject();  //获取form 所有数据转换json数据
        delete data['ID'];
        delete data['名称'];
        delete data['值'];
        delete data['调整量'];
        delete data['调整历史'];
        delete data['来源单据ID'];
        delete data['调整原因'];
        delete data['调整结果'];
        delete data['计量单位'];
        delete data['描述']
        delete data['单据类型'];
        if ($('#txtModuleType').val() == "") {
            bmflag = 1;
            localStorage.lastbm = "";
            localStorage.lastbmmc = "";
        }
        if ($('#txtzbmc').val() == "") {
            zbflag = 1;
            localStorage.lastzb = "";
            localStorage.lastzbmc = "";
        }
        if (bmflag == 0) {
            top.window.layer.msg('选择的部门不存在');
            return;
        };
        if (zbflag == 0) {
            top.window.layer.msg('选择的指标不存在');
            return;
        };
        lastyear = $('#form_year').val();
        if (lastyear != "") {
            localStorage.lastyear = $('#form_year').val();
        }
        lastmoon = $('#form_month').val();
        if (lastmoon != "") {
            localStorage.lastmoon = $('#form_month').val();
        }
        lastbm = $('#bumen_id').val();
        if (lastbm != "") {
            localStorage.lastbm = $('#bumen_id').val();
            localStorage.lastbmmc = $('#txtModuleType').val();
        }
        lastzb = $('#zhibiao_id').val();
        if (lastzb != "") {
            localStorage.lastzb = $('#zhibiao_id').val();
            localStorage.lastzbmc = $('#txtzbmc').val();
        }
        var json = JSON.stringify(data);
        json = json.replace(/\"/g, "'");
        localStorage.ListQueryJson = json;
        // console.log(localStorage.ListQueryJson/);
        top.window.layer.close(localStorage.layerindex);
    });

    //----------save--------------------
    $("#btntable-save").off("click").on("click", function () {

       
        if (localStorage.FormMode == "Edit") {
            var haha = $('#Text3').val();
            if (isNaN(haha)) {
                top.window.layer.msg("请输入数字");
                return;
            }
            ////////////////////////////////////////////
            var _kfalg;
            var message;
            var kdatajson = "{\"json\":[\"" + $("#form_year").val() + "\",\"" + $("#form_month").val() + "\",\"P\",\"\"]}"
            $.ajax({
                type: "POST",
                async: false,
                url: "/BAPI/BAPI_ASHX.ashx",
                data: { "api": "MC.YMJYGL.Server.YMJYGL.assessmentMange.Monthly.BAPI_查询_是否月结", "type": "json", "ticket": pub.State.Ticket, "data": kdatajson },
                dataType: "Json",
                error: function (xhr, status, error) {
                    alert(error);
                },
                success: function (data) {
                    _kfalg = data.json.State;
                    message = data.json.Message;
                }
            }
            );
            if (!parseInt(_kfalg)) {
                layer.msg(message);
                return;
            }
            ///////////////////////////////////////////
            var data = $("#frmdata").serializeObject(); //自动将form表单封装成json ,name属性
            data.table = $("#frmdata").data("table");
            var dzjs = "调整时间:" + getNowFormatDate() + "调整结果:" + $('#Text4').val() + "调整原因:" + $('#Text5').val();
            data['调整历史'] = dzjs + " | " + $('#Text6').val();
            //alert(JSON.stringify(data));
            // var str = JSON.stringify(jjson);
            FormAction1(data, "M", localStorage.mid);
        }
        else {
            var jjson = {};

            //tablename 
            var table = $("#frmdata").attr("data-table");
            jjson.单据类型 = '考核调整';
            //alert(table);
            jjson.datas = [];
            jjson.delfields = [];
            var grid = mc_grid_dic['grid_2'];
            jjson.datas = grid.getData().getItems();

            if (jjson.datas == "") {

                top.window.layer.msg("没有数据保存");
                return;
            }
            var jjson_json = [];
            var falg = 0;
            // var jjson_json_json = [];
            for (i = 0; i < jjson.datas.length; i++) {

                if (jjson.datas.length == 1) {
                    if (jjson.datas[i].调整量 != undefined || jjson.datas[i].调整结果 != undefined) {

                        if (jjson.datas[i].调整原因 == undefined) {
                            jjson.datas[i].调整原因 = null;

                        }

                        jjson_json.push(jjson.datas[i]);
                    }
                    else {

                        top.window.layer.msg("没有创建数据");
                        return;
                    }
                }
                else {
                    if (jjson.datas[i].调整量 != undefined || jjson.datas[i].调整结果 != undefined) {
                        if (jjson.datas[i].调整原因 == undefined) {
                            jjson.datas[i].调整原因 = null;
                        }
                        //if (jjson.datas[i]. == undefined) {
                        //    jjson.datas[i].调整原因 = '0';
                        //}
                        jjson_json.push(jjson.datas[i]);
                    }
                    else {

                        ++falg;

                    }
                }

            }
            if (falg == jjson.datas.length) {
                top.window.layer.msg("没有创建数据");
                return;
            }
            jjson.datas = jjson_json;

            jjson.delfields = ['状态', '本月实际'];
            jjson.table = $("#frmdata").data("table");
            FormAction2(jjson, "C", localStorage.mid);
        }
    });

    /////系统获取当前时间
    function getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
                + " " + date.getHours() + seperator2 + date.getMinutes()
                + seperator2 + date.getSeconds();
        return currentdate;
    }
    function FormAction2(data, action, mid) {

        //R C M D    R  ready   c   create  m   xiuggai  d delete
        var json = { "json": [data, action, mid] };
        var __str = JSON.stringify(json);
        $.ajax({
            type: "POST",
            url: "/BAPI/BAPI_ASHX.ashx",
            data: { "api": "MC.YMJYGL.Server.YMJYGL.business.Plan.BAPI_月度调整JSON处理", "type": "json", "ticket": pub.State.Ticket, "data": __str },
            dataType: "json",
            error: function (xhr, status, error) {
                alert(error);
            },
            success: function (data) {
                //   console.log(data.json.Data);
                if (data.json.State == "1") {

                    if (action == "R") {
                        console.log(data.json.Data.dt);

                        //error?
                        $("#frmdata").fill(data.json.Data.dt[0], { styleElementName: 'none' });


                    }




                    //if (action == "D") {
                    //       //删除关闭
                    //       //  console.log(data.json.Data);
                    //       top.window.layer.close(localStorage.layerindex);

                    //   } else {
                    top.window.layer.msg("操作成功");
                    //   }
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
    function FormAction1(data, action, mid) {
        //R C M D    R  ready   c   create  m   xiuggai  d delete
        var json = { "json": [data, action, mid] };
        var __str = JSON.stringify(json);
        $.ajax({
            type: "POST",
            url: "/BAPI/BAPI_ASHX.ashx",
            data: { "api": "MC.YMJYGL.Server.YMJYGL.common.OperateDb.BAPI_单表JSON处理", "type": "json", "ticket": pub.State.Ticket, "data": __str },
            dataType: "json",
            error: function (xhr, status, error) {
                alert(error);
            },
            success: function (data) {
                //   console.log(data.json.Data);
                if (data.json.State == "1") {
                    if (action == "R") {
                        console.log(data.json.Data.dt);

                        //error?
                        $("#frmdata").fill(data.json.Data.dt[0], { styleElementName: 'none' });


                    }
                    if (action == "M") {
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

    //----------add--------------------




    //--------------------------------------
    //$("#btntable-edit").off("click").on("click", function() {
    //    localStorage.FormMode = "Edit";
    //    //修改标题
    //    top.window.layer.title("窗口模式 - 编辑");
    //    $('input').removeAttr("readonly");
    //    $('input').removeAttr("disabled");
    //    $('select').removeAttr("disabled");
    //    $('button').removeAttr("disabled");
    //    isDisabled = false; //禁用输入器
    //});

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

                if (data.json.State == "1") {
                    //console.log(data.json.Data.dt)
                    //填充列表
                    $.each(data.json.Data.dt, function (i, item) {

                        $(selector).append("<option value='" + item.ID + "'>" + item["名称"] + "</option>");

                    });

                } else {
                    ndkh

                }
            }

        });
    }
    //-----------窗体增删改查事件--------------------
    function FormAction(data, action, mid) {

        //R C M D    R  ready   c   create  m   xiuggai  d delete
        var json = { "json": [data, action, mid] };
        var __str = JSON.stringify(json);
        $.ajax({
            type: "POST",
            url: "/BAPI/BAPI_ASHX.ashx",
            data: { "api": "MC.YMJYGL.Server.YMJYGL.common.OperateDb.BAPI_数据初始化", "type": "json", "ticket": pub.State.Ticket, "data": __str },
            dataType: "json",
            error: function (xhr, status, error) {
                alert(error);
            },
            success: function (data) {
                if (!data.json.Data.dt.length) {
                    layer.msg('没有数据！');
                    return;
                };
                //   console.log(data.json.Data);
                if (data.json.State == "1") {
                    if (action == "R") {

                       // localStorage.search_array = JSON.stringify(data.json.Data);
                        //var json = JSON.stringify(localStorage.search_array);//获取本地数据搜过的数据
                       // var json1 = JSON.parse(json).replace("\"dt\":", "");//进行json转换
                        //var json3 = json1.substring(1, json1.length - 1);//截取字符串
                        var data1 = data.json.Data.dt;
                        //data1 = JSON.parse(json3);//重新让字符串变成json



                        var gridid = $(".detail-table").attr("id");
                        console.log(gridid);
                        var grid = mc_grid_dic[gridid];
                        //console.log(data1[0].本月实际);
                        var dataview = grid.getData();
                        console.log(data1);
                        dataview.setItems(data1);
                        grid.setColumns(grid.getColumns());//修复显示不全的问题
                    }
                    if (action == "C") {

                        localStorage.search_array = JSON.stringify(data.json.Data);
                        var json = JSON.stringify(localStorage.search_array);//获取本地数据搜过的数据
                        var json1 = JSON.parse(json).replace("\"dt\":", "");//进行json转换
                        var json3 = json1.substring(1, json1.length - 1);//截取字符串
                        var data1 = [];
                        data1 = JSON.parse(json3);//重新让字符串变成json
                        //  console.log(data1);
                        //var table = $(".detail-table").data('table');
                        // console.log(table);
                        var gridid = $(".detail-table").attr("id");
                        //console.log(gridid);
                        var grid = mc_grid_dic[gridid];
                        // console.log(grid);
                        var dataview = grid.getData();

                        dataview.setItems(data1);
                        //  console.log(JSON.parse(localStorage.search_array));
                        // alert('afaf');
                    }
                    else if (action == "D") {
                        //删除关闭
                        //  console.log(data.json.Data);
                        // alert('afaf');
                        top.window.layer.close(localStorage.layerindex);

                    } else {
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
    //--------------
    //  $('input').attr("readonly", "readonly");
    // $('button').attr("disabled", "disabled");

    // localStorage.FormMode = "Add";//test

    if (localStorage.FormMode != "Add") {

        //FormAction1(localStorage.BillId, "R", localStorage.mid);
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
        $('input').attr("disabled", "disabled"); //checkbox
        $('button').attr("disabled", "disabled");
        $('select').attr("disabled", "disabled");
        $('textarea').attr('disabled', 'disabled');
        $('#form-group').css('display', 'block');
        $('#form-group1').css('display', 'block');
        $('#form-group2').css('display', 'block');
        $('#form-group3').css('display', 'block');
        FormAction1(localStorage.BillId, 'R', localStorage.mid);

        //slickgrid readonly
        //$(".detail-table").each(function(i, item) {
        //    var grid = mc_grid_dic[$(item).attr("id")]
        //    grid.setOptions({ editable: false });
        //});
        isDisabled = true; //禁用输入器 
    }
    if (localStorage.FormMode == "Add") {

        //解决这个固定模块ID获取
        //点击菜单进行赋值
        //FormAction(localStorage.BillId, "R", localStorage.mid);
        $('#btntable-go').removeAttr('disabled');
        $('#btntable-back').removeAttr('disabled');
        $('#btntable-delete').attr("disabled", "disabled");
        $('#myTab').removeAttr('hidden', 'hidden');
        $('#btntable-search-list').css('display', 'none');
        $('#form-group').css('display', 'block');
        $('#myTabContent').removeAttr("hidden", "hidden");//子表隐藏
        $('#myTab').css('margin-top', '-30px');
        $('#btntable-delete').attr("disabled", "disabled");
        // $('#myTabContent').css('margin-top', '-0px');//子表隐藏


        //slickgrid readonly
        //$(".detail-table").each(function (i, item) {
        //    var grid = mc_grid_dic[$(item).attr("ID")]
        //    grid.setOptions({ editable: false });
        //});

        // alert(1212);
        //  console.log(grid);
        isDisabled = false; //禁用输入器




    }
    if (localStorage.FormMode == "Edit") {
        bflag = 1;
        flag = 1;
        $('input').removeAttr("readonly");
        $('input').removeAttr("disabled");
        $('select').removeAttr("disabled");
        $('button').removeAttr("disabled");
        $('#btntable-search-list').attr("disabled", "disabled");
        $('#btntable-delete').attr("disabled", "disabled");
        $('#btntable-save').removeAttr("disabled");
        $('#btntable-search').css('display', 'none'); 
        $('#form-group').css('display', 'block');
        $('#form-group1').css('display', 'block');
        $('#form-group2').css('display', 'block');
        $('#form-group3').css('display', 'block'); 
        $('#form_year').attr("disabled", "disabled");
        $('#form_month').attr("disabled", "disabled");
        $('#txtModuleType').attr("disabled", "disabled");
        $('#input_group_btn_bumen_s').attr("disabled", "disabled");
        $('#txtzbmc').attr("disabled", "disabled");
        $('#txtzhibiao').attr("disabled", "disabled");
        $('#计量单位').attr("disabled", "disabled");
        $('#值').attr("disabled", "disabled");
        $('#Text6').attr("disabled", "disabled");
        //$('#txtModuleType').attr("disabled", "disabled");
        //$('#txtzbmc').attr("disabled", "disabled");
        isDisabled = false; //禁用输入器
        $(".detail-table").each(function (i, item) {

            //var grid = mc_grid_dic[$(item).attr("id")]
            //grid.setOptions({ editable: true });
        })
        FormAction1(localStorage.BillId, 'R', localStorage.mid);

    }
    /////////////////添加创建
    //if (localStorage.FormMode == "CE") {

    //    $('#form-group').css('display', 'block');
    //    $('#form-group1').css('display', 'block');
    //    $('#form-group2').css('display', 'block');
    //    $('#form-group3').css('display', 'block');
    //    $('#form_group4').css('display', 'block');
    //    if (localStorage.mc_grid_selectedrow) {
    //        //alert("done");
    //        var json = JSON.parse(localStorage.mc_grid_selectedrow);
    //        // console.log(json);
    //        // alert(json.单据年);
    //        // alert(json.单据月);
    //        // $("select[name='单据年']").val(json.单据年);

    //        $("#frmdata").fill(json, { styleElementName: 'none' });//绑定数据放在form里


    //        //bind
    //        localStorage.mc_grid_selectedrow = "";
    //    }



    //}


    if (localStorage.FormMode == "Delete") {
        //  alert(localStorage.BillId);
        $('input').attr("disabled", "disabled"); //checkbox
        $('button').attr("disabled", "disabled");
        $('select').attr("disabled", "disabled");
        $('textarea').attr('disabled', 'disabled');
        $('#btntable-delete').removeAttr("disabled");
        isDisabled = true; //禁用输入器
        $('#form-group').css('display', 'block');
        $('#form-group1').css('display', 'block');
        $('#form-group2').css('display', 'block');
        $('#form-group3').css('display', 'block');

        FormAction1(localStorage.BillId, 'R', localStorage.mid);
    }
    if (localStorage.FormMode == 'Search') {
        //  alert();
        $('#form-group1').attr('hidden', 'hidden');
        $('#form-group2').attr('hidden', 'hidden');
        $('#form-group3').attr('hidden', 'hidden');
        $('#btntable-go').removeAttr('disabled');
        $('#btntable-back').removeAttr('disabled');
        $('#myTabContent').attr('hidden', 'hidden');
        $('#btntable-search').css('display', 'none');
        $('#btntable-search-list').css('display', 'block');
        $('#btntable-save').attr("disabled", "disabled");
        $('#xianshi').css('height', '500px');
        $('#btntable-delete').attr("disabled", "disabled");
        if (localStorage.lastyear == undefined) {
            var oDate = new Date(); //实例一个时间对象；
            var year = oDate.getFullYear();   //获取系统的年
            var year1 = oDate.getFullYear() + 5;   //获取系统的年
            var year2 = oDate.getFullYear() + 5;   //获取系统的年
            var i = 0;
            var html = "";
            while (i++ < 8) {
                if (year1 === year) {
                    html += "<option value='" + year + "' selected='selected'>" + year + "</option>";
                    year1 = year - 1;
                    year2 = year - 1;
                }
                else {
                    html += "<option value='" + year1-- + "'>" + year2-- + "</option>";
                }
            }
            $("#form_year").html(html);//年份id
        }
        else {
            var oDate = new Date(); //实例一个时间对象；
            var year = oDate.getFullYear();   //获取系统的年
            var year1 = oDate.getFullYear() + 5;   //获取系统的年
            var year2 = oDate.getFullYear() + 5;   //获取系统的年
            var i = 0;
            var html = "";
            var year3 = "";
            for (i = 0; i < 8; i++)
            {
                year3 = year1 - i;
                if (localStorage.lastyear == year3) {
                    html += "<option value='" + year3 + "' selected='selected'>" + year3 + "</option>";
                }
                else {
                    html += "<option value='" + year1 + "'>" + year2 + "</option>";
                }
            }
        }
        if (localStorage.lastmoon == undefined) {
            var oDate = new Date(); //实例一个时间对象；
            var month = oDate.getMonth();
            var select = document.getElementById('form_month');
            var option = select.getElementsByTagName('option');
            for (var i = 0; i < option.length; i++) {
                if (parseInt("" + option[i].value + "", 10) === month + 1) {
                    option[i].setAttribute("selected", "selected");
                };
            };
        }
        else {
            var month = localStorage.lastmoon;
            var select = document.getElementById('form_month');
            var option = select.getElementsByTagName('option');
            for (var i = 0; i < option.length; i++) {
                if (parseInt("" + option[i].value + "", 10) === month) {
                    option[i].setAttribute("selected", "selected");
                };
            };
        }
        if (localStorage.lastbm == undefined) {
            $('#txtModuleType').val();
        }
        else {
            $('#txtModuleType').val(localStorage.lastbmmc);
        }
        if (localStorage.lastzb == undefined) {
            $('#txtzbmc').val();
        }
        else {
            $('#txtzbmc').val(localStorage.lastzbmc);
        }
        isDisabled = true; //禁用输入器
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
                if (data.json.State == "1") {
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
                if (data.json.State == "1") {
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