import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import { login, logout } from '@/api/users';
import router, { resetRouter } from '@/router';
import { PermissionModule } from './permission';
import { TagsViewModule } from './tags-view';
import store from '@/store';
import { localStorage_del_user, localStorage_get_user, localStorage_set_user } from '@/utils/local-storage';
import { Message } from 'element-ui';

/**
 * 用户接口： 用户通用字段
 * 以下字段几乎所有SW业务系统的用户类型都会涉及
 * 主要是： 患者 | 医生 | 护士 | 管理系统用户
 * 因此作为通用用户字段
 */
export interface IUserState {
  token: string // rest请求的 accessToken
  imToken: string // imToken
  refreshToken: string // refreshToken
  roles: any[] // 角色数组
  name: string // 姓名
  avatar: string // 头像
  id: number | null // id
  phone: string // 手机
  sex: string // 性别
  idCard: string // 身份证
  email: string // 邮箱
  userState: string // 用户状态： 启用 | 停用
  ossPath: string // 文件云上根路径
  [key: string]: any
}

const local_user = localStorage_get_user();

/**
 * store内的变量在刷新的时候会重新初始化（内存变量）
 * 而每次路由跳转会判断内存变量token是否存在（详见permission.ts），若不存在则会通过 GetUserInfo 获取一次
 * GetUserInfo 会从 localStorage 中获取，若未获取到，则退出到登录界面
 */
@Module({ dynamic: true, store, name: 'user' })
class User extends VuexModule implements IUserState {
  // 用户通用字段
  public token = local_user ? local_user.accessToken : ''
  public imToken = local_user ? local_user.imToken : ''
  public refreshToken = local_user ? local_user.refreshToken : ''
  public roles: any[] = []
  public name = ''
  public avatar = ''
  public id: number | null = null
  public phone = ''
  public sex = ''
  public idCard = ''
  public email = ''
  public userState = ''
  public ossPath = ''
  // 业务系统字段
  public shopId: number | null = null // 当前登录的商铺

  @Action
  public async Login(userInfo: { username: string, password: string, shopId: any }) {
    let { username, password, shopId } = userInfo;
    username = username.trim();
    const { data } = await login({ phone: username, password, shopId });
    if (!data) {
      throw Error('获取用户信息失败');
    }
    // 构造用户信息
    const user = {
      time: +new Date(),
      ossPath: data.ossPath + '/',
      shopId: data.shopId,
      ...data.authToken,
      ...data.userVO
    };
    // test only
    user.roleIdList = user.roleIdList.concat(['admin']);
    // to 内存
    this.SET_INFO(user);
    // to localStorage
    localStorage_set_user(user);
  }

  @Action
  public ClearUser() {
    localStorage_del_user();
    this.CLEAN_INFO();
  }

  @Action
  public async GetUserInfo() {
    const user = localStorage_get_user();
    if (!user) {
      throw Error('获取本地用户信息失败，请重新登录');
    }
    this.SET_INFO(user);
    if (!this.token) {
      throw Error('用户token不存在');
    }
    if (this.roles.length === 0) {
      Message.error('用户无任何权限');
      throw Error('用户无任何权限');
    }
  }

  @Action
  public async ChangeRoles(role: string) {
    // Dynamically modify permissions
    await this.GetUserInfo();
    resetRouter();
    // Generate dynamic accessible routes based on roles
    PermissionModule.GenerateRoutes(this.roles);
    // Add generated routes
    router.addRoutes(PermissionModule.dynamicRoutes);
    // Reset visited views and cached views
    TagsViewModule.delAllViews();
  }

  @Action
  public async LogOut() {
    if (this.token === '') {
      throw Error('LogOut: token is undefined!');
    }
    await logout();
    resetRouter();
    // Reset visited views and cached views
    TagsViewModule.delAllViews();
    this.ClearUser();
  }

  @Mutation
  private SET_INFO(user: any) {
    // 用户通用字段
    this.ossPath = user.ossPath;
    this.token = user.accessToken || '';
    this.imToken = user.imToken || '';
    this.refreshToken = user.refreshToken || '';
    this.roles = user.roleIdList || [];
    this.name = user.userName;
    this.avatar = this.ossPath + user.userAvatar;
    this.id = user.id;
    this.phone = user.phone;
    this.sex = user.userSex === '0' ? '男' : '女';
    this.idCard = user.idCard;
    this.email = user.userEmail;
    this.userState = user.userState.userState === '0' ? '停用' : '启用';
    // 业务系统字段
    this.shopId = user.shopId;
  }

  @Mutation
  private CLEAN_INFO() {
    // 用户通用字段
    this.ossPath = '';
    this.token = '';
    this.imToken = '';
    this.refreshToken = '';
    this.roles = [];
    this.name = '';
    this.avatar = '';
    this.id = null;
    this.phone = '';
    this.sex = '';
    this.idCard = '';
    this.email = '';
    this.userState = '';
    // 业务系统字段
    this.shopId = null; // 当前登录的商铺
  }
}

export const UserModule = getModule(User);
