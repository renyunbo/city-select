// pages/component/areaSelect/aresSelect.js
var city_new = require('../../../utils/city.js');
var cityData_new = city_new.data.RECORDS;

var app = getApp();

var provinceName = '' // 选择省区 -名字
var province_id = ''; // 选择省区 -id

var cityName = '' // 选择市区 - 名字
var city_id = ''; // 选择省区 -id

var countyName = '' // 选择县区 -名字
var county_id = ''; // 选择省区 -id

// 所有的 省市区 集合  
var result_province = cityData_new.filter(
  function (value) {
    return (value.level_type == 1);
  }
);
var result_city = cityData_new.filter(
  function (value) {
    return (value.level_type == 2);
  }
);
var result_county = cityData_new.filter(
  function (value) {
    return (value.level_type == 3);
  }
);

// 当前的 省市区 集合
var province_s = result_province
var city_s = []; // “市区”集合
var county_s = [];// “县区”集合

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //是否显示城市选择弹框
    isCity:{
      type:Boolean,
      value:true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 城市数据
    provinces: province_s,
    citys: city_s,
    countys: county_s,
    cityValue: [0, 0, 0],
    cityText: '',
    cityCode: '',
    isCity: true // 是否选择弹出 选择城市
  },

  /**
   * 组件的方法列表
   */
  methods: {

    clickMask(){
      this.setData({isCity:false});
    },
    //选择地区
    sureAction(){
      var that = this;
      that.setData({
        isCity: false
      });
      this.triggerEvent('sureAction')
    },
    selectResultAction: function (data, event) {

      var result = data.filter(
        function (value) {
          return (value.parent_id == event);
        }
      );
      return result;
    },
    //城市选择器
    cityChange: function (e) {
      var val = e.detail.value // 改变的picker 每一列对应的下标位置
      var t = this.data.cityValue; // 原本的位置 
      if (val[0] != t[0]) { // 第一列改变
        city_s = [];
        county_s = [];
        var current_id = province_s[val[0]].id;
        city_s = this.selectResultAction(result_city, current_id);
        var current_city_id = city_s[0].id;
        county_s = this.selectResultAction(result_county, current_city_id);
        this.setData({
          citys: city_s,
          countys: county_s,
          cityValue: [val[0], 0, 0]
        })
        return;
      }
      if (val[1] != t[1]) {// 第二列改变
        county_s = [];
        var current_city_id = city_s[val[1]].id;
        county_s = this.selectResultAction(result_county, current_city_id);
        this.setData({
          countys: county_s,
          cityValue: [val[0], val[1], 0]
        })
        return;
      }
      if (val[2] != t[2]) {// 第三列改变
        this.setData({
          county: this.data.countys[val[2]],
          cityValue: val
        })
        return;
      }
      this.triggerEvent('cityChange')
    },
    //确定选择
    _ideChoice: function (e) {
      var that = this;
      var $act = e.currentTarget.dataset.act;
      var $mold = e.currentTarget.dataset.mold;

      //城市
      if ($act == 'confirm' && $mold == 'city') {

        var t = this.data.cityValue; // 原本的位置 

        // 记录当前选择的省市区ID  
        province_id = province_s[t[0]].id;
        city_id = city_s[t[1]].id;
        county_id = county_s[t[2]].id;

        // 记录当前选择的省市区名称
        provinceName = province_s[t[0]].name;
        cityName = city_s[t[1]].name;
        countyName = county_s[t[2]].name;

        that.cityText = provinceName + '-' + cityName + '-' + countyName
        that.cityCode = province_id + '-' + city_id + '-' + county_id
        that.setData({
          cityText: that.cityText,
          cityCode: that.cityCode

        })
      }

      that.setData({
        isCity: true
      });
      let cityText = that.cityText;
      let cityCode = that.cityCode;
      this.triggerEvent('ideChoice', { cityText,cityCode});
    }
  }
})
