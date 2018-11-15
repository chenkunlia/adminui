<template>
  <div>
    <el-dialog title="" :visible.sync="visibled" @close="onClose" top="4vh" width="60%">
      <div style="margin:0rem 1rem;">
        <el-form width="70%" ref="dataForm"  :rules="rules" :model="temp" label-width="100px" label-position="left">
          <tip-title title="一、基础信息">
            <el-row>
              <el-col :span="12">
                <el-form-item label="标题：" prop="dutyName">
                  <el-input v-model="temp.dutyName" :disabled="dialogStatus=='show'" style="width:58%;"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="值班类型：" prop="dutyType">
                  <el-select v-model="temp.dutyType" disabled>
                    <el-option v-for="item in dutyTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="开始日期：" prop="beginTime">
                  <el-date-picker v-model="temp.beginTime" type="date"  v-if="timeV" :default-value="beginTimeValue" placeholder="选择日期" :disabled="dialogStatus!='create'||(dutyType=='water'&&lastDate!='')" :picker-options="beginTimeOptions">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="结束日期：" prop="endTime">
                  <el-date-picker v-model="temp.endTime" type="date" v-if="timeV" :default-value="endTimeValue" placeholder="选择日期" :disabled="dialogStatus!='create'" :picker-options="endTimeOptions">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="dialogStatus=='create'">
              <el-col style="text-align:center;margin-bottom: 10px;">
                <span style="color:red;">请确认好开始日期与结束日期，当生成值班计划后将无法修改！</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-form-item label="备注：" prop="note">
                  <el-input type="textarea" v-model="temp.note" :disabled="dialogStatus=='show'">无</el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </tip-title>
          <tip-title title="二、值班信息">
            <div class="operate-container">
              <el-button type="primary" v-if="dutyType!=='holiday'&&dialogStatus=='create'" icon="el-icon-circle-plus-outline" @click="handleCreate">增加排班</el-button>
              <el-button type="primary" v-if="dutyType==='holiday'&&dialogStatus!='show'" icon="el-icon-circle-plus-outline" @click="addDay">新增天</el-button>
              <el-button type="primary" v-if="dutyType!=='holiday'&&dialogStatus=='create'" icon="el-icon-circle-plus-outline" @click="clearDuty">清除排班</el-button>
              <el-button type="danger" v-if="dutyType=='holiday'&&dialogStatus!='show'" icon="el-icon-remove-outline" @click="batchRemove" :disabled="this.selectedRows.length===0">删除</el-button>
            </div>
            <el-table v-if="dutyType=='water'" ref="table" v-loading="listLoading" key="water" :height="height" :data="temp.waterDetailList" border fit highlight-current-row @selection-change="selsChange" style="width: 100%;">
              <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
              <el-table-column label="日期" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.dutyDateMsg}}</span>
                </template>
              </el-table-column>

              <el-table-column label="值班总负责" align="center">
                <template slot-scope="scope">
                  <span v-if="!scope.row.enableUpdate ||dialogStatus=='show'">{{scope.row.mainLeaderNames.join(',')}}</span>
                  <el-select v-else  v-model="scope.row.mainLeaderIds" multiple filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="query=>remoteMethod(query,scope.row.mainLeaderIds,scope.row.mainLeaderMap)" :loading="loading">
                    <el-option v-for="(val,key) in scope.row.mainLeaderMap" :key="key" :label="val" :value="key">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>

              <el-table-column label="值班负责人" align="center">
                <template slot-scope="scope">
                  <span v-if="!scope.row.enableUpdate ||dialogStatus=='show'">{{scope.row.viceLeaderNames.join(',')}}</span>
                  <el-select v-else v-model="scope.row.viceLeaderIds" multiple filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="query=>remoteMethod(query,scope.row.viceLeaderIds,scope.row.viceLeaderMap)" :loading="loading">
                    <el-option v-for="(val,key) in scope.row.viceLeaderMap" :key="key" :label="val" :value="key">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>

              <el-table-column label="主班" align="center">
                <template slot-scope="scope">
                  <span v-if="!scope.row.enableUpdate ||dialogStatus=='show'">{{scope.row.mainDutyNames.join(',')}}</span>
                  <el-select v-else v-model="scope.row.mainDutyIds" multiple filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="query=>remoteMethod(query,scope.row.mainDutyIds,scope.row.mainDutyMap)" :loading="loading">
                    <el-option v-for="(val,key) in scope.row.mainDutyMap" :key="key" :label="val" :value="key">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>

              <!-- <el-table-column label="副班" align="center">
                <template slot-scope="scope">
                  <span v-if="!scope.row.enableUpdate">{{scope.row.viceDutyNames.join(',')}}</span>
                  <el-select v-else v-model="scope.row.viceDutyIds" multiple filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="query=>remoteMethod(query,scope.row.viceDutyIds,scope.row.viceDutyMap)" :loading="loading">
                    <el-option v-for="(val,key) in scope.row.viceDutyMap" :key="key" :label="val" :value="key" />
                  </el-select>
                </template>
              </el-table-column> -->

              <el-table-column label="运维人员" align="center">
                <template slot-scope="scope">
                  <span v-if="!scope.row.enableUpdate ||dialogStatus=='show'">{{scope.row.operationNames.join(',')}}</span>
                  <el-select v-else v-model="scope.row.operationIds" multiple filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="query=>remoteMethod(query,scope.row.operationIds,scope.row.operationMap)" :loading="loading">
                    <el-option v-for="(val,key) in scope.row.operationMap" :key="key" :label="val" :value="key" />
                  </el-select>
                </template>
              </el-table-column>

              <el-table-column label="备注" align="center">
                <template slot-scope="scope">
                  <el-input v-if="scope.row.enableUpdate &&dialogStatus!='show'" v-model="scope.row.note">{{scope.row.note}}</el-input>
                  <span v-else>{{scope.row.note}}</span>
                </template>
              </el-table-column>

            </el-table>

            <el-table v-if="dutyType=='defense'"  ref="table" v-loading="listLoading" key="defense" :height="height" :data="temp.defenseDetailList" border fit highlight-current-row @selection-change="selsChange" style="width: 100%;">
              <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
              <el-table-column label="日期" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.dutyDateMsg}}</span>
                </template>
              </el-table-column>

              <el-table-column label="值班领导" align="center">
                <template slot-scope="scope">
                  <span v-if="!scope.row.enableUpdate ||dialogStatus=='show'">{{scope.row.mainLeaderNames.join(',')}}</span>
                  <el-select style="width:100%" v-else v-model="scope.row.mainLeaderIds" multiple filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="query=>remoteMethod(query,scope.row.mainLeaderIds,scope.row.mainLeaderMap)" :loading="loading">
                    <el-option v-for="(val,key) in scope.row.mainLeaderMap" :key="key" :label="val" :value="key">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>

              <el-table-column label="值班负责人" align="center">
                <template slot-scope="scope">
                  <span v-if="!scope.row.enableUpdate ||dialogStatus=='show'">{{scope.row.viceLeaderNames.join(',')}}</span>
                  <el-select style="width:100%" v-else v-model="scope.row.viceLeaderIds" multiple filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="query=>remoteMethod(query,scope.row.viceLeaderIds,scope.row.viceLeaderMap)" :loading="loading">
                    <el-option v-for="(val,key) in scope.row.viceLeaderMap" :key="key" :label="val" :value="key">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>

              <el-table-column label="主班" align="center">
                <template slot-scope="scope">
                  <span v-if="!scope.row.enableUpdate ||dialogStatus=='show'">{{scope.row.mainDutyNames.join(',')}}</span>
                  <el-select style="width:100%" v-else v-model="scope.row.mainDutyIds" multiple filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="query=>remoteMethod(query,scope.row.mainLeaderIds,scope.row.mainLeaderMap)" :loading="loading">
                    <el-option v-for="(val,key) in scope.row.mainDutyMap" :key="key" :label="val" :value="key">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>

              <!-- <el-table-column label="副班" align="center">
                <template slot-scope="scope">
                  <span v-if="!scope.row.enableUpdate">{{scope.row.viceDutyNames.join(',')}}</span>
                  <el-select v-else v-model="scope.row.viceDutyIds" multiple filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="query=>remoteMethod(query,scope.row.viceDutyIds,scope.row.viceDutyMap)" :loading="loading">
                    <el-option v-for="(val,key) in scope.row.viceDutyMap" :key="key" :label="val" :value="key" />
                  </el-select>
                </template>
              </el-table-column> -->

              <el-table-column label="司机" align="center">
                <template slot-scope="scope">
                  <span v-if="!scope.row.enableUpdate ||dialogStatus=='show'">{{scope.row.driverNames.join(',')}}</span>
                  <el-select style="width:100%" v-else v-model="scope.row.driverIds" multiple filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="query=>remoteMethod(query,scope.row.driverIds,scope.row.driverMap)" :loading="loading">
                    <el-option v-for="(val,key) in scope.row.driverMap" :key="key" :label="val" :value="key" />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="加派人员" align="center">
                <template slot-scope="scope">
                  <span v-if="!scope.row.enableUpdate ||dialogStatus=='show'">{{scope.row.additionNames.join(',')}}</span>
                  <el-select style="width:100%" v-else v-model="scope.row.additionIds" multiple filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="query=>remoteMethod(query,scope.row.additionIds,scope.row.additionMap)" :loading="loading">
                    <el-option v-for="(val,key) in scope.row.additionMap" :key="key" :label="val" :value="key" />
                  </el-select>
                </template>
              </el-table-column>

              <el-table-column label="备注" align="center">
                <template slot-scope="scope">
                  <el-input style="width:100%" v-if="scope.row.enableUpdate&&dialogStatus!='show'" v-model="scope.row.note">{{scope.row.note}}</el-input>
                  <span v-else>{{scope.row.note}}</span>
                </template>
              </el-table-column>

            </el-table>
            <el-table v-if="dutyType=='holiday'"  ref="table" v-loading="listLoading" key="holiday" :height="height" :data="temp.holidayDetailList" border fit highlight-current-row @selection-change="selsChange" style="width: 100%;">
              <el-table-column  type="selection" width="55" align="center"></el-table-column>
              <el-table-column label="日期" align="center">
                <template slot-scope="scope">
                  <el-date-picker v-if="scope.row.enableUpdate&&dialogStatus!='show'" @change="dateChange(scope.row)" v-model="scope.row.dutyDate" :picker-options="dutyDateOptions"></el-date-picker>
                  <span v-else>{{ scope.row.dutyDateMsg}}</span>
                </template>
              </el-table-column>

              <el-table-column label="带班领导" align="center">
                <template slot-scope="scope">
                  <span v-if="!scope.row.enableUpdate ||dialogStatus=='show'">{{scope.row.mainLeaderNames.join(',')}}</span>
                  <el-select style="width:100%" v-else v-model="scope.row.mainLeaderIds" multiple filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="query=>remoteMethod(query,scope.row.mainLeaderIds,scope.row.mainLeaderMap)" :loading="loading">
                    <el-option v-for="(val,key) in scope.row.mainLeaderMap" :key="key" :label="val" :value="key">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>

              <el-table-column label="值班科室" align="center">
                <template slot-scope="scope">
                  <span v-if="!scope.row.enableUpdate ||dialogStatus=='show'">{{scope.row.departmentNames.join(',')}}</span>
                  <el-select style="width:100%" v-else v-model="scope.row.departmentIds" multiple filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="query=>remoteSectionMethod(query,scope.row.departmentIds,scope.row.departmentMap)" :loading="loading">
                    <el-option v-for="(val,key) in scope.row.departmentMap" :key="key" :label="val" :value="key">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>

              <el-table-column label="坐班人员" align="center">
                <template slot-scope="scope">
                  <span v-if="!scope.row.enableUpdate ||dialogStatus=='show'">{{scope.row.clerkNames.join(',')}}</span>
                  <el-select style="width:100%" v-else v-model="scope.row.clerkIds" multiple filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="query=>remoteMethod(query,scope.row.clerkIds,scope.row.clerkMap)" :loading="loading">
                    <el-option v-for="(val,key) in scope.row.clerkMap" :key="key" :label="val" :value="key">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>

              <el-table-column label="备注" align="center">
                <template slot-scope="scope">
                  <el-input style="width:100%" v-if="scope.row.enableUpdate &&dialogStatus!='show'" v-model="scope.row.note">{{scope.row.note}}</el-input>
                  <span v-else>{{scope.row.note}}</span>
                </template>
              </el-table-column>

              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button v-if=" dialogStatus!='show'&&scope.row.enableUpdate" type="danger" size="mini" @click="deleteArrange(scope.row,scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </tip-title>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <span v-if="!disable&&dialogStatus!='show'" style="width:100%;">
            <el-button v-if="id==''" type="primary" @click="createData">{{ $t('table.confirm') }}</el-button>
            <el-button v-else type="primary" @click="updateData">{{ $t('table.confirm') }}</el-button>
          </span>
          <el-button @click="visibled = false">{{ $t('table.cancel') }}</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog title="生成规则" :visible.sync="prodRuleVisible" @close="onProdClose">
      <el-form width="30%" ref="prodForm" :model="prodTemp" label-width="90px" label-position="center">
        <el-form-item :label="dutyType!='holiday'?'值班总负责:':'带班领导'">
          <el-col :span="18">
            <el-form-item>
              <el-select style="width:100%" v-model="prodTemp.mainLeaderRules.ids" multiple filterable remote reserve-keyword placeholder="输入关键字或空格搜索" @change="personChange" :remote-method="remoteSearchMethod" :loading="loading">
                <el-option v-for="item in personOptions" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="轮询天数：">
              <el-input type="number" v-model="prodTemp.mainLeaderRules.days"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item v-if="dutyType!=='holiday'" label="值班负责人:">
          <el-col :span="18">
            <el-form-item>
              <el-select v-model="prodTemp.viceLeaderRules.ids" style="width:100%" multiple filterable remote reserve-keyword placeholder="输入关键字或空格搜索" @change="personChange" :remote-method="remoteSearchMethod" :loading="loading">
                <el-option v-for="item in personOptions" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="轮询天数：">
              <el-input type="number" v-model="prodTemp.viceLeaderRules.days"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item v-if="dutyType!=='holiday'" label="主班:">
          <el-col :span="18">
            <el-form-item>
              <el-select v-model="prodTemp.mainDutyRules.ids" style="width:100%" multiple filterable remote reserve-keyword placeholder="输入关键字或空格搜索" @change="personChange" :remote-method="remoteSearchMethod" :loading="loading">
                <el-option v-for="item in personOptions" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="轮询天数：">
              <el-input type="number" v-model="prodTemp.mainDutyRules.days"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item v-if="dutyType=='defense'" label="副班:">
          <el-col :span="18">
            <el-form-item>
              <el-select v-model="prodTemp.viceDutyRules.ids" style="width:100%" multiple filterable remote reserve-keyword placeholder="输入关键字或空格搜索" @change="personChange" :remote-method="remoteSearchMethod" :loading="loading">
                <el-option v-for="item in personOptions" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="轮询天数：">
              <el-input type="number" v-model="prodTemp.viceDutyRules.days"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item v-if="dutyType=='water'" label="运维人员:">
          <el-col :span="18">
            <el-form-item>
              <el-select v-model="prodTemp.operationRules.ids" style="width:100%" multiple filterable remote reserve-keyword placeholder="输入关键字或空格搜索" @change="personChange" :remote-method="remoteSearchMethod" :loading="loading">
                <el-option v-for="item in personOptions" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="轮询天数：">
              <el-input type="number" v-model="prodTemp.operationRules.days"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item v-if="dutyType=='defense'" label="司机:">
          <el-col :span="18">
            <el-form-item>
              <el-select v-model="prodTemp.driverRules.ids" style="width:100%" multiple filterable remote reserve-keyword placeholder="输入关键字或空格搜索" @change="personChange" :remote-method="remoteSearchMethod" :loading="loading">
                <el-option v-for="item in personOptions" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="轮询天数：">
              <el-input type="number" v-model="prodTemp.driverRules.days"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item v-if="dutyType=='defense'" label="加派人员:">
          <el-col :span="18">
            <el-form-item>
              <el-select v-model="prodTemp.additionRules.ids" style="width:100%" multiple filterable remote reserve-keyword placeholder="输入关键字或空格搜索" @change="personChange" :remote-method="remoteSearchMethod" :loading="loading">
                <el-option v-for="item in personOptions" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="轮询天数：">
              <el-input type="number" v-model="prodTemp.additionRules.days"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item v-if="dutyType=='holiday'" label="坐班人员:">
          <el-col :span="18">
            <el-form-item>
              <el-select v-model="prodTemp.clerkRules.ids" style="width:100%" multiple filterable remote reserve-keyword placeholder="输入关键字或空格搜索" @change="personChange" :remote-method="remoteSearchMethod" :loading="loading">
                <el-option v-for="item in personOptions" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="轮询天数：">
              <el-input type="number" v-model="prodTemp.clerkRules.days"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="prodDutyArrange">生成</el-button>
        <el-button @click="prodRuleVisible = false">{{ $t('table.cancel') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog title="生成规则" :visible.sync="waterProdRuleVisible" @close="onWaterProdClose">
      <el-form width="30%" ref="prodForm" :model="prodTemp" label-width="90px" label-position="center">
        <el-row>
          <el-col :span="12">
            <el-form-item label="开始日期：" prop="beginTime">
              <el-date-picker style="width:100%;" disabled v-model="prodTemp.beginTime" type="date" placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="值班天数：" prop="days">
              <el-input type="number" v-model="prodTemp.days" :min="1"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="值班总负责:" prop="id">
              <el-select style="width:100%" v-model="prodTemp.mainLeaderRules.id" filterable remote reserve-keyword placeholder="输入关键字或空格搜索" @change="personSingleChange" :remote-method="remoteSearchMethod" :loading="loading">
                <el-option v-for="item in personOptions" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="值班负责人:">
              <el-select v-model="prodTemp.viceLeaderRules.id" style="width:100%"  filterable remote reserve-keyword placeholder="输入关键字或空格搜索" @change="personSingleChange" :remote-method="remoteSearchMethod" :loading="loading">
                <el-option v-for="item in personOptions" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="主班:">
              <el-select v-model="prodTemp.mainDutyRules.id" style="width:100%"  filterable remote reserve-keyword placeholder="输入关键字或空格搜索" @change="personSingleChange" :remote-method="remoteSearchMethod" :loading="loading">
                <el-option v-for="item in personOptions" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="运维人员:">
              <el-select v-model="prodTemp.operationRules.id" style="width:100%"  filterable remote reserve-keyword placeholder="输入关键字或空格搜索" @change="personSingleChange" :remote-method="remoteSearchMethod" :loading="loading">
                <el-option v-for="item in personOptions" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="prodWaterDutyArrange">增加</el-button>
        <el-button @click="waterProdRuleVisible = false">{{ $t('table.cancel') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { notify } from "@/commons/utils/notify";
import {
  addWaterDuty,
  addDefenseDuty,
  addHolidayDuty,
  updateWaterDuty,
  updateDefenseDuty,
  updateHolidayDuty,
  getWaterDuty,
  getDefenseDuty,
  getHolidayDuty
} from "@/commons/api/duty";
import { getOrgansData } from "@/commons/api/system";
import { getPersonOptions } from "@/commons/api/dutyPerson";
import { dutyArrangeRules } from "@/commons/utils/validate";
import TipTitle from "@/components/TipTitle";
import { dateDiff, format } from "@/commons/utils";
import { setTimeout } from 'timers';

export default {
  components: {
    TipTitle
  },
  props: {
    value: {},
    defaultValue: {
      type: Object
    },
    id: {
      type: String,
      default: ""
    },
    dialogStatus: {
      type: String,
      default: "create"
    },
    disable: {
      type: Boolean,
      default: false
    },
    dutyType: {
      type: String,
      default: "water"
    },
    lastDate:{
      type:String,
      default:''
    }
  },
  data() {
    return {
      temp: {
        deleteDetailIds: [],
        dutyId: "",
        dutyName: " ",
        endTime: " ",
        note: "无",
        insertDetails: [],
        updateDetails: []
      },
      index:0,
      activeName: "first",
      rules: dutyArrangeRules,
      visibled: false,
      waterProdRuleVisible: false,
      userOptions: [],
      selectedRows: [],
      personMap: {},
      loading: false,
      tableKey: "water",
      listLoading: false,
      dutyTypeOptions: [
        { label: "水量调度值班", value: "1" },
        { label: "三防值班", value: "2" },
        { label: "单位节假日值班", value: "3" }
      ],
      dutyTypeMap:{water:1,defense:2,holiday:3},
      prodRuleVisible: false,
      loading: false,
      personOptions: [],
      prodTemp: {
        days:7,
        mainLeaderRules: {
          id: "",
          ids: [],
          days: 1
        },
        viceLeaderRules: {
          id: "",
          ids: [],
          days: 1
        },
        mainDutyRules: {
          id: "",
          ids: [],
          days: 1
        },
        viceDutyRules: {
          id: "",
          ids: [],
          days: 1
        },
        operationRules: {
          id: "",
          ids: [],
          days: 1
        },
        driverRules: {
          id: "",
          ids: [],
          days: 1
        },
        additionRules: {
          id: "",
          ids: [],
          days: 1
        },
        clerkRules: {
          id: "",
          ids: [],
          days: 1
        }
      },
      holidayData: {
        deleteDetailIds: [],
        dutyId: "",
        dutyName: "",
        endTime: " ",
        note: "无",
        insertDetails: [],
        updateDetails: []
      },
      status:'create',
      height:350,
      timeV:true
    };
  },
  //变量值更新监听
  watch: {
    value(newValue, oldValue) {
      this.visibled = newValue;
      this.temp = {}
     // this.$refs["dataForm"].clearValidate();
      if(newValue){
        if (this.id && this.id !== null && this.id !== "") {
          if (this.dutyType === "water") {
            getWaterDuty({ id: this.id }).then(res => {
              this.temp = res.data;
              this.validateTime()
            });
          } else if (this.dutyType === "defense") {
            getDefenseDuty({ id: this.id }).then(res => {
              this.temp = res.data;
              this.validateTime()
            });
          } else {
            getHolidayDuty({ id: this.id }).then(res => {
              this.temp = res.data;
              this.validateTime()
            });
          }

        } else {
          this.temp = {};
        }
      }
      this.deleteDetailIds = [];
      if (this.dutyType === "water") {
        this.temp.dutyType = "1";
      } else if (this.dutyType === "defense") {
        this.temp.dutyType = "2";
      } else {
        this.temp.dutyType = "3";
      }
      if(this.dutyType=='water'&&this.lastDate!=''){
        let date=new Date(this.lastDate)
        date.setDate(date.getDate()+1)
        this.temp.beginTime=format(date,'yyyy-MM-dd')
      }
    },
    visibled(val) {
      this.$emit("input", val);
    },
    id(newValue, oldValue) {
      
    },
    dialogStatus(newValue,oldValue){
      this.status=newValue
    },
    lastDate(newValue,oldValue){
      // let date=new Date(newValue)
      // date.setDate(date.getDate()+1)
      // if(this.dutyType=='water'){
      //   this.temp.beginTime=format(date,'yyyy-MM-dd')
      // }
    },
  },
  created() {},
  updated() {
    this.visibled = this.value;
  },
  computed:{
    endTimeOptions(){
      let that=this
        return {
            disabledDate(time) {
              if(that.temp.beginTime){
                if(that.dutyType=='water'&&that.lastDate!=''){
                  return time.getTime() <=new Date(that.lastDate);
                }else{
                  return time.getTime() <new Date(that.temp.beginTime);
                }
              }else{
                return time.getTime() < Date.now();
              }
            }
          }
      },
    beginTimeOptions(){
      let that=this
        return {
            disabledDate(time) {
              if(that.dutyType!='water'&&that.lastDate!=''){
                return time.getTime() <= new Date(that.lastDate)||(that.temp.endTime!==''?time.getTime()>new Date(that.temp.endTime):false);
              }else{
                return false;
              }
            }
          }
      },
    dutyDateOptions(){
      let that=this
        return {
            disabledDate(time) {
                return time.getTime() <new Date(that.temp.beginTime)||(time.getTime()>new Date(that.temp.endTime));
            }
          }
      },
      beginTimeValue(){
        return this.temp.endTime||this.lastDate
      },
      endTimeValue(){
        return this.beginTime||this.lastDate
      }
  },
  methods: {
    //创建值班
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.temp.beginTime = format(this.temp.beginTime, "yyyy-MM-dd");
          this.temp.endTime = format(this.temp.endTime, "yyyy-MM-dd");
          let dif=dateDiff(this.temp.beginTime,this.temp.endTime)+1
          
          this.temp.detailVOList = [];
          if (this.temp.waterDetailList) {
            this.temp.detailVOList = this.temp.waterDetailList;
          }
          if (this.temp.defenseDetailList) {
            this.temp.detailVOList = this.temp.defenseDetailList;
          }
          if (this.temp.holidayDetailList) {
            this.temp.detailVOList = this.temp.holidayDetailList;
            this.temp.detailVOList.map(item=>{
              item.dutyDate=format(item.dutyDate,'yyyy-MM-dd')
            })
            let tempList=_.uniqBy(this.temp.detailVOList,'dutyDate')
            if(tempList.length!==this.temp.detailVOList.length){
              this.notify('排班日期重复！','error')
              return 
            }
          }
          if(this.dutyType!='holiday'&&this.temp.detailVOList.length!==dif){
            this.notify('记录条数不等于开始时间与结束时间的间隔天数！','error')
            return 
          }
          this.temp.detailVOList.map(item => {
            this.handleItem(item);
          });
          let flag=this.validList(this.temp.detailVOList)
          if(flag){
            this.notify('相关人员不能为空！','error')
            return 
          }
          if (this.dutyType === "water") {
            addWaterDuty(this.temp).then(response => {
              var res = notify(this, response);
              if (res) {
                this.visibled = false;
                this.$emit("success", response);
              }
            });
          } else if (this.dutyType === "defense") {
            addDefenseDuty(this.temp).then(response => {
              var res = notify(this, response);
              if (res) {
                this.visibled = false;
                this.$emit("success", response);
              }
            });
          } else {
            addHolidayDuty(this.temp).then(response => {
              var res = notify(this, response);
              if (res) {
                this.visibled = false;
                this.$emit("success", response);
              }
            });
          }
          this.$nextTick(() => {
            this.$refs["dataForm"].clearValidate(); //清除校验
          });
        }
      });
    },
    validList(list){
      let keys = [
        "mainLeader",
        "viceLeader",
        "mainDuty",
        "viceDuty",
        "operation",
        "driver",
        "addition",
        "clerk",
        "department"
      ]
      let flag=false
      if(list&&list.length>0){
        list.map(item=>{
          for(var i in keys){
            if(item[keys[i]+'Ids']&&item[keys[i]+'Ids'].length==0){
              flag=true
              break
            }
          }
        })
      }
      return flag
    },
    // 选中行
    selsChange: function(sels) {
      this.selectedRows = sels;
    },
    //远程查找
    remoteMethod(query, ids, itemMap) {
      if (query && query !== "") {
        this.loading = true;
        let listQuery=this.listQuery(query)
        getPersonOptions(listQuery).then(res => {
          if (res.data) {
            res.data.map((row, index) => {
              itemMap[row.id] = row.name;
            });
          }
          this.loading = false;
        });
      } else {
      }
    },  

    //远程查找
    remoteSectionMethod(query, ids, itemMap) {
      if (query && query !== "") {
        this.loading = true;
        let listQuery=this.listQuery(query)
        getOrgansData(listQuery).then(res => {
          if (res.data.list) {
            res.data.list.map((row, index) => {
              itemMap[row.departmentId] = row.name;
            });
          }
          this.loading = false;
        });
      } else {
      }
    },
    //查找条件处理
    listQuery(query){
      let listQuery
        if(query===" "){
        listQuery={dutyType:this.dutyTypeMap[this.dutyType]}
        }else{
          listQuery={name:query,dutyType:this.dutyTypeMap[this.dutyType]}
        } 
        return listQuery
    },
    //远程查找方法
    remoteSearchMethod(query) {
      if (query && query !== "") {
        this.loading = true;
        let listQuery=this.listQuery(query)
        getPersonOptions(listQuery).then(res => {
          this.personOptions = res.data;
          if (res.data) {
            res.data.map(item => {});
          }
          this.loading = false;
        });
      } else {
        this.personOptions = [];
      }
    },

    //更新数据
    updateData() {
      let that=this
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          console.log("dutyType",that.dutyType)
          if(this.dutyType=="holiday"){
            this.temp.holidayDetailList.map(item=>{
              item.dutyDate=format(item.dutyDate,'yyyy-MM-dd')
            })
            let tempList=_.uniqBy(this.temp.holidayDetailList,'dutyDate')
            if(tempList.length!==this.temp.holidayDetailList.length){
              this.notify('排班日期重复！','error')
              return 
            }
          }
          console.log("temp", this.temp);
          this.handleTemp(this.temp);
          this.temp.dutyId = this.temp.id;
          let flag=this.validList(this.temp.updateDetails)||this.validList(this.temp.insertDetails)
          if(flag){
            this.notify('相关人员或科室不能为空！','error')
            return 
          }
          if (this.dutyType === "water") {
            updateWaterDuty(this.temp).then(response => {
              var res = notify(this, response);
              if (res) {
                this.visibled = false;
                this.$emit("success", response);
              }
            });
          } else if (this.dutyType === "defense") {
            updateDefenseDuty(this.temp).then(response => {
              var res = notify(this, response);
              if (res) {
                this.visibled = false;
                this.$emit("success", response);
              }
            });
          } else {
            updateHolidayDuty(this.temp).then(response => {
              var res = notify(this, response);
              if (res) {
                this.visibled = false;
                this.$emit("success", response);
              }
            });
          }
        }
      });
    },

    //处理表单提交数据
    handleTemp(data) {
      data.beginTime = format(data.beginTime, "yyyy-MM-dd");
      data.endTime = format(data.endTime, "yyyy-MM-dd");
      data.deleteDetailIds = this.deleteDetailIds;
      data.insertDetails = [];
      data.updateDetails = [];
      if (this.dutyType === "water") {
        data.waterDetailList.map(item => {
          if (item.enableUpdate) {
            this.genPersonMap(data, item);
          }
        });

      } else if (this.dutyType === "defense") {
        data.defenseDetailList.map(item => {
          if (item.enableUpdate) {
            this.genPersonMap(data, item);
          }
        });
      } else {
        data.holidayDetailList.map(item => {
          if (item.enableUpdate) {
            this.genPersonMap(data, item);
          }
        });
      }

    },

    validateTime(){
      console.log("validateTime")
      this.timeV=false
      let that=this
      setTimeout(()=>{
        that.timeV=true
      },200)
      // this.$refs.dataForm.validateField('beginTime')
      // this.$refs.dataForm.validateField('endTime')
    },

    //生成人员信息
    genPersonMap(data, item) {
      let keys = [
        "mainLeader",
        "viceLeader",
        "mainDuty",
        "viceDuty",
        "operation",
        "driver",
        "addition",
        "clerk",
        "department"
      ];
      let detail = {};
      keys.map(key => {
        if (item[key + "Ids"]) {
          item[key + "Names"] = [];
          item[key + "Ids"].map(id => {
            if (this.personMap[id]) {
              item[key + "Names"].push(this.personMap[id]); //更新Names里面的数据
            } else {
              item[key + "Names"].push(item[key + "Map"][id]);
            }
          });
          detail[key + "Ids"] = item[key + "Ids"];
          detail[key + "Names"] = item[key + "Names"];
          detail.dutyDate = item.dutyDate;
          detail.note = item.note;
        }
      });
      detail.dutyId = this.temp.id;
      if (item.id) {
        detail.detailId = item.id;
        data.updateDetails.push(detail); //将更新记录保存
      } else {
        data.insertDetails.push(detail); //将插入记录保存
      }
    },

    //处理字段数据
    handleItem(item) {
      let keys = [
        "mainLeader",
        "viceLeader",
        "mainDuty",
        "viceDuty",
        "operation",
        "driver",
        "addition",
        "clerk",
        "department"
      ];
      keys.map(key => {
        if (item[key + "Ids"]) {
          item[key + "Names"] = [];
          item[key + "Ids"].map(id => {
            if (this.personMap[id]) {
              item[key + "Names"].push(this.personMap[id]); //更新Names里面的数据
            } else {
              item[key + "Names"].push(item[key + "Map"][id]);
            }
          });
        }
      });
    },
    onClose() {
      this.height=350
      this.$refs['dataForm'].clearValidate();
      this.personOptions=[]
      for(var key in this.prodTemp){
        if(key!='days'){
          this.prodTemp[key].id=''
          this.prodTemp[key].ids=[]
          this.prodTemp[key].days=1
        }
      }
      this.temp.beginTime=new Date()
      this.temp.endTime=new Date()
      this.validateTime()
    },
    onProdClose(){},
    onWaterProdClose(){},
    clearDuty() {
      console.log("clearDuty")
      if (this.temp.waterDetailList) {
        this.temp.waterDetailList = [];
      }
      if (this.temp.defenseDetailList) {
        this.temp.defenseDetailList = [];
      }
      this.listLoading=true
      let _this=this
      setTimeout(()=>{_this.listLoading=false},100)
    },

    //打开生成值班
    handleCreate() {
      if (!this.temp.beginTime || !this.temp.endTime) {
        this.$notifyNative(this,"开始日期和结束日期不能为空!",'error')
        return;
      }
      if(this.dutyType==='defense'){
        this.prodRuleVisible = true;
      }else if(this.dutyType==='water'){
        let waterList=this.temp.waterDetailList
        let actDays=0
        if(waterList&&waterList.length>0){
          actDays=waterList.length
          let date=new Date(waterList[waterList.length-1].dutyDate)
          date.setDate(date.getDate()+1)
          this.prodTemp.beginTime=format(date,'yyyy-MM-dd')
        }else{
          this.prodTemp.beginTime=this.temp.beginTime
        }
        let dif=dateDiff(format(this.temp.beginTime,'yyyy-MM-dd'),format(this.temp.endTime,'yyyy-MM-dd'))+1
        let leftDays=dif-actDays
        if(leftDays<7&&leftDays>0){
          this.prodTemp.days=leftDays
        }else if(leftDays<=0){
          this.$notifyNative(this,"所选日期范围内不能再安排值班!",'error')
          return;
        }
        this.waterProdRuleVisible=true
      }
    },

    //时间改变
    dateChange(row){
      let startDif=dateDiff(this.temp.beginTime,row.dutyDate)
      let endDif=dateDiff(row.dutyDate,format(this.temp.endTime,'yyyy-MM-dd'))
      if(startDif<0||endDif<0){
        this.$notifyNative(this,"所选日期不能超出开始日期和结束日期的范围！",'error')
         row.dutyDate=this.temp.endTime
      }
    },

    //人员改变时保存皱起值对
    personChange(val) {
      val.map((v, index) => {
        this.personOptions.map((item, index) => {
          if (item.id === v) {
            this.personMap[item.id] = item.name;
          }
        });
      });
      console.log("person:", val);
    },

    //单选下拉框值改变时处理方法
    personSingleChange(val) {
        this.personOptions.map((item, index) => {
          if (item.id === val) {
            this.personMap[item.id] = item.name;
          }
        });
    },

    //批量删除
    batchRemove() {
      let _this=this
      let rows=this.selectedRows
      this.$confirm("确定要删除所选记录吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let list = rows;
          let resultList=_this.temp.holidayDetailList
          if(list&&list.length>0){
            list.map(row=>{
              if (row.id) {
                _this.deleteDetailIds.push(row.id);
                _.remove(resultList,(r)=>{
                  return row.id===r.id
                })
              }else{
                _.remove(resultList,(r)=>{
                  return row.index===r.index
                })
              }
            })
          }
          _this.flushList(_this.temp.holidayDetailList)
        })
        .catch(() => {});
    },

    //删除一条值班详情
    deleteArrange(row,index) {
      console.log(row);
      this.$confirm("确定要删除此条记录吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let list = this.temp.holidayDetailList;
          if (row.id) {
            this.deleteDetailIds.push(row.id);
          }
            list.splice(index, 1);
        })
        .catch(() => {});
    },

    //生成水量调度值班
    prodWaterDutyArrange(){
      let keys=['mainLeader','viceLeader','mainDuty','operation']
      let startDate=new Date(this.prodTemp.beginTime)
      let list=[]
      let days=Number(this.prodTemp.days)
      let dif=dateDiff(format(startDate,'yyyy-MM-dd'),format(this.temp.endTime,'yyyy-MM-dd'))
      if(days>(dif+1)){
        days=dif+1
      }
      for(var i=0;i<days;i++){
        let detail={}
        keys.map(key=>{
          this.genMap(detail,this.prodTemp[key+"Rules"].id,key)
        })
        detail["dutyDateMsg"] = format(startDate, "yyyy/MM/dd");
        detail["dutyDate"] = startDate.getTime();
        detail.note=""
        detail.enableUpdate = 1;
        startDate.setDate(startDate.getDate() + 1);
        list.push(detail)
      }
      if(this.temp.waterDetailList){
        this.temp.waterDetailList.push(...list)
      }else{
        this.temp.waterDetailList=list
      }
      this.waterProdRuleVisible=false
      this.flushList(this.temp.waterDetailList)
    },

    //刷新表格
    flushList(list){
    this.listLoading=true
    let _this=this
    
    if(list[0]){
      this.$refs['table'].setCurrentRow(list[0])
     }
    setTimeout(()=>{_this.listLoading=false},100)
     setTimeout(()=>{
              _this.$refs['table'].setCurrentRow(list[1])
     },100)
     if(this.height==400){
      this.height=350
    }else{
      this.height=400
    }
    },
    //生成值班安排
    prodDutyArrange() {
      console.log("arranges:", this.prodTemp);
      console.log("temp", this.temp);
      if(!this.temp.beginTime||!this.temp.endTime){
        this.$notifyNative(this,"开始日期和结束日期不能为空!",'error')
        return;
      }
      let dif = dateDiff(format(this.temp.beginTime,'yyyy-MM-dd'), format(this.temp.endTime,'yyyy-MM-dd'));
      let list = [];
      if (dif < 0) {
        this.$notifyNative(this,"开始日期不能大于结束日期!",'error')
        return;
      } else if (dif == 0) {
        list = this.genList(this.prodTemp, this.temp.beginTime, 1);
      } else {
        list = this.genList(this.prodTemp, this.temp.beginTime, dif + 1);
      }
      //将数据加入表格显示
      if (this.dutyType === "water") {
        if (this.temp.id) {
          this.temp.waterDetailList.push(...list);
        } else {
          this.temp.waterDetailList = list;
        }
      } else if (this.dutyType === "defense") {
        if (this.temp.id) {
          this.temp.defenseDetailList.push(...list);
        } else {
          this.temp.defenseDetailList = list;
        }
      } else {
        if (this.temp.holidayDetailList) {
          this.temp.holidayDetailList.push(...list);
        } else {
          this.temp.holidayDetailList = list;
        }
      }
      this.$refs['table'].doLayout()
      this.flushList(list)
      this.prodRuleVisible = false;
    },

    //生成表格数据
    genList(rules, start, days) {
      let details = [];
      let startDate = new Date(start);
      let mainLeaderList = [],
        viceLeaderList = [],
        mainDutyList = [],
        viceDutyList = [],
        operationList = [],
        driverList = [],
        additionList = [],
        clerkList = [];
      rules.mainLeaderRules;
      this.rulesToList(rules.mainLeaderRules, mainLeaderList);
      this.rulesToList(rules.viceLeaderRules, viceLeaderList);
      this.rulesToList(rules.mainDutyRules, mainDutyList);
      this.rulesToList(rules.viceDutyRules, viceDutyList);
      this.rulesToList(rules.operationRules, operationList);
      this.rulesToList(rules.driverRules, driverList);
      this.rulesToList(rules.additionRules, additionList);
      this.rulesToList(rules.clerkRules, clerkList);
      //生成每天的数据
      console.log("days", days);
      for (var i = 0; i < days; i++) {
        let detail = {};
        if (mainLeaderList.length > 0) {
          this.genMap(
            detail,
            mainLeaderList[i % mainLeaderList.length],
            "mainLeader"
          );
        }
        if (viceLeaderList.length > 0) {
          this.genMap(
            detail,
            viceLeaderList[i % viceLeaderList.length],
            "viceLeader"
          );
        }
        if (mainDutyList.length > 0) {
          this.genMap(
            detail,
            mainDutyList[i % mainDutyList.length],
            "mainDuty"
          );
        }
        if (viceDutyList.length > 0) {
          this.genMap(
            detail,
            viceDutyList[i % viceDutyList.length],
            "viceDuty"
          );
        }
        if (operationList.length > 0) {
          this.genMap(
            detail,
            operationList[i % operationList.length],
            "operation"
          );
        }
        if (driverList.length > 0) {
          this.genMap(detail, driverList[i % driverList.length], "driver");
        }
        if (additionList.length > 0) {
          this.genMap(
            detail,
            additionList[i % additionList.length],
            "addition"
          );
        }
        if (clerkList.length > 0) {
          this.genMap(detail, clerkList[i % clerkList.length], "clerk");
        }
        startDate.setDate(startDate.getDate() + (i == 0 ? 0 : 1));
        detail["dutyDateMsg"] = format(startDate, "yyyy/MM/dd");
        detail["dutyDate"] = startDate.getTime();
        detail.enableUpdate = 1;
        if (this.dutyType === "holiday") {
          detail.departmentIds = [];
          detail.departmentNames = [];
          detail.departmentMap = {};
        }
        details.push(detail);
      }
      return details;
      console.log("details", details);
    },

    //新增一天
    addDay() {
      if (!this.temp.beginTime || !this.temp.endTime) {
        this.$notifyNative(this,'开始日期和结束日期不能为空','error')
        return;
      }
      let dif=dateDiff(format(this.temp.beginTime,'yyyy-MM-dd'),format(this.temp.endTime,'yyyy-MM-dd'))+1
      let date
        let list=this.temp.holidayDetailList
      if(list&&list.length>0){
        if(list.length>=dif){
          this.$notifyNative(this,'不能新增大于排班天数的记录','error')
          return
        }

        date=new Date(list[list.length-1].dutyDate)
        date.setDate(date.getDate()+1)
      }else{
        this.temp.holidayDetailList=[]
        date=new Date(this.temp.beginTime)
      }

      let detail = {};
      let keys=["mainLeader","department","clerk"]
      keys.map(key=>{
        this.genMap(detail,"",key)
      })
      detail.note=""
      if(this.temp.endTime){
        let endDif=dateDiff(format(date,'yyyy-MM-dd'),format(this.temp.endTime,'yyyy-MM-dd'))
        if(endDif<0){
          date=new Date(this.temp.endTime)
        }
      }
      detail.dutyDate=date.getTime()
      detail.dutyDateMsg=format(date,'yyyy-MM-dd')
      detail.index=this.index++
      detail.enableUpdate=true
      this.temp.holidayDetailList.push(detail)
      this.flushList(this.temp.holidayDetailList)
    },

    //生成每个角色的数据
    genMap(detail, id, name) {
      if(id!==""){
        detail[name + "Names"] = [this.personMap[id]];
        detail[name + "Ids"] = [id];
        let map = {};
        map[id] = this.personMap[id];
        detail[name + "Map"] = map;
      }else{
        detail[name + "Map"] = {};
        detail[name + "Names"] = [];
        detail[name + "Ids"] = [];
      }
    },

    //按照规则生成ids数组
    rulesToList(rule, list) {
      rule.ids.map(id => {
        for (var i = 0; i < rule.days; i++) {
          list.push(id);
        }
      });
    },

    handleResponse(res,msgType){
      if(res.code==0){
        if(msgType=='update'){
          this.notify('更新成功','success')
        }else if(msgType=='add'){
          this.notify('添加成功','success')
        }else if(msgType=='delete'){
          this.notify('删除成功','success')
        }
      }else if(res.code==-2){
        if(msgType=='update'){
          this.notify('更新失败','error')
        }else if(msgType=='add'){
          this.notify('添加失败','error')
        }else if(msgType=='delete'){
          this.notify('删除失败','error')
        }
      }
    },
    notify(msg,showType){
      if(showType=='success'){
        this.$notify.success({
                title: "成功",
                message: msg,
                duration: 2 * 1000
              });
      }else if(showType=='error'){
        this.$notify.error({
                title: "失败",
                message: msg,
                duration: 2 * 1000
              });
      }
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
//数据面板
.data-container {
  margin-top: 20px;
}
.dialog-footer{
  width: 95%;
  margin-top: 2rem;
  text-align: right;
}
.operate-container{
  margin-bottom: 0.5rem;
}
</style>