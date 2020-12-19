import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import { login, logout } from '@/api/users';
import router, { resetRouter } from '@/router';
import { PermissionModule } from './permission';
import { TagsViewModule } from './tags-view';
import store from '@/store';
import {
  localStorage_del_token,
  localStorage_get,
  localStorage_get_token, localStorage_set_token,
  removeUser,
  setUser
} from '@/utils/local-storage';
import { Message } from 'element-ui';

/**
 * 用户接口： 用户通用字段
 * 以下字段几乎所有SW业务系统的用户类型都会涉及
 * 主要是： 患者 | 医生 | 护士 | 管理系统用户
 * 因此作为通用用户字段
 */
export interface IUserState {
  token: string // rest请求的 accessToken
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

@Module({ dynamic: true, store, name: 'user' })
class User extends VuexModule implements IUserState {
  private static tokenKey = 'accessToken';
  private static userKey = 'user';

  // 用户通用字段
  public token = localStorage_get_token()
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
  // public user = getUser() || null
  public user = localStorage_get(User.userKey)

  @Mutation
  private set_token(token: string) {
    this.token = token;
  }

  @Mutation
  private set_ossPath(ossPath: string) {
    this.ossPath = ossPath;
  }

  @Mutation
  private set_user(user: any) {
    this.user = user;
    this.ossPath = user.ossPath + '/';
    this.shopId = user.shopId;
    const userVo = user.userVO;
    if (userVo) {
      this.name = userVo.userName;
      this.avatar = this.ossPath + userVo.userAvatar;
      this.email = userVo.userEmail;
      this.id = userVo.id;
      this.idCard = userVo.idCard;
      this.phone = userVo.phone;
      this.sex = userVo.userSex === '0' ? '男' : '女';
      this.userState = userVo.userState === '0' ? '停用' : '启用';
    } else {
      Message.error('用户信息缺失');
      throw Error('用户信息缺失');
    }
    if (this.userState === '停用') {
      Message.error('用户已停用');
      throw Error('用户已停用');
    }
  }

  @Mutation
  private set_roles(roles: any[]) {
    this.roles = roles;
  }

  @Action
  public async Login(userInfo: { username: string, password: string, shopId: any}) {
    let { username, password, shopId } = userInfo;
    username = username.trim();
    const { data } = await login({ phone: username, password, shopId });
    localStorage_set_token(data.authToken.accessToken);
    setUser(data);
    this.set_token(data.authToken.accessToken);
    this.set_user(data);

    // const { data } = await login({ phone: username, password, shopId });
  }

  @Action
  public ResetToken() {
    localStorage_del_token();
    this.set_token('');
    this.set_roles([]);
  }

  @Action
  public async GetUserRoles() {
    if (!this.token) {
      Message.error('用户token不存在');
      throw Error('用户token不存在');
    }
    if (!this.user) {
      Message.error('用户校验失败');
      throw Error('用户校验失败');
    }
    let roles: any[] = [];
    if (this.user.userVO) {
      roles = this.user.userVO.roleIdList || [];
    }
    if (roles.length !== 0) {
      this.set_roles(roles.concat(['admin']));
    } else {
      Message.error('用户无任何权限');
      throw Error('用户无任何权限');
    }
  }

  @Action
  public async ChangeRoles(role: string) {
    // Dynamically modify permissions
    const token = role + '-token';
    this.set_token(token);
    localStorage_set_token(token);
    await this.GetUserRoles();
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
    localStorage_del_token();
    removeUser();
    resetRouter();

    // Reset visited views and cached views
    TagsViewModule.delAllViews();
    this.set_token('');
    this.set_roles([]);
  }
}

export const UserModule = getModule(User);
