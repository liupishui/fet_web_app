
import { ServerResponse, IncomingMessage } from "http";
import type * as table_class from './core/app_init/db/sqlite/table_class';
import type * as fetSqlite from './db';
import type * as defaultTables from './db/default_tables'
declare global {
    interface Context {
        req: IncomingMessage;
        reqAddress: string;
        res: ServerResponse;
        url: Url;
        use: (fun: useMethod) => void;
        runtime?: number;
        [key: string]: any;
    }
    interface App {
        action: any;
        config: {
            path?: string;
            port?: string;
            url?: string;
            /** 静态目录 相对于/view/目录 */
            staticPath?: Array[string];
            /** 当遇到/时，如果没有对应action时，默认加载的页面，默认index.html */
            defaultPage?: Array[string];

        };
        decode: (string: string) => string;
        decodeURIComponentSafe: (string: string) => string;
        deepClone: (target: any) => any;
        deepMerge: (target: any, source: any) => any;
        encode: (string: string) => string;
        encodeURIComponentSafe: (string: string) => string;
        /** 输入小于10的数字，比如输入1返回01，输入9返回09 */
        fileZero: (number: number) => number;
        getNowTime: () => {
            /** 年-月-日 时-分-秒 */
            full: string;
            /** 年-月-日 */
            date: string;
            /** 时:分:秒 */
            time: string;
            /** 时间戳 */
            number: number;
        },
        getRemoteIp: Promise<any>;
        /** 处理http请求的中间件的路径 */
        httpHandlerPath: string;
        lib: Array;
        LRU: any;
        LRU_HREF_PAGE: any;
        print: () => void;
        printAll: () => void;
        require: ( /** 模块路径 */ modulePath: any, /** 是否动态加载,默认否 */ dynamic?: boolean) => any;
        /** 已经加载了的模块 */
        requireModules: any;
        /** 所有定时任务 */
        schedules: any;
        server: any;
        /** 服务器路径 */
        serverPath: string;
        sqlite: fetSqlite;
        tables: defaultTables;
        utils: {
            enterprise: Enterprise;
            [key: string]: any
        }
        [key: string]: any;
    }
    interface Url {
        auth?: string | null;
        hash?: string | null;
        host?: string | null;
        hostname: string;
        href: string;
        parse: (urlString: string) => Url;
        path: string;
        pathname: string;
        port: string;
        protocol: string;
        query: Object | any;
        search?: string | null;
        slashes: boolean;
        toString: () => string;
    }
    interface useMethod {
        (context: Context, app: StatsFs): void;
    }
    /** better-sqlite3 table */
    interface table extends table_class {
        // get:()=>any;
    }
    interface Enterprise {
        constructor(...args: any[]);

        banner_add(...args: any[]): void;

        banner_get(...args: any[]): void;

        banner_list(...args: any[]): void;

        banner_update(...args: any[]): void;

        category_delete(...args: any[]): void;

        category_list(...args: any[]): void;

        clientssay_list(...args: any[]): void;

        contact_delete(...args: any[]): void;

        contact_list(...args: any[]): void;

        contact_list_server(...args: any[]): void;

        contact_readed(...args: any[]): void;

        context_add(...args: any[]): void;

        domain_list(...args: any[]): void;

        friendlink_list(...args: any[]): void;

        friendlink_list_server(...args: any[]): void;

        getContactlength(...args: any[]): void;

        get_domain_id(...args: any[]): void;

        image_add(...args: any[]): void;

        image_get(...args: any[]): void;

        image_list(...args: any[]): void;

        image_list_server(...args: any[]): void;

        image_modify(...args: any[]): void;

        isAdmin(...args: any[]): void;

        isLogin(...args: any[]): void;

        message_delete(...args: any[]): void;

        message_list(...args: any[]): void;

        message_readed(...args: any[]): void;

        news_articles_add(...args: any[]): void;

        news_articles_get(...args: any[]): void;

        news_articles_list(...args: any[]): void;

        news_articles_list_server(...args: any[]): void;

        news_articles_update(...args: any[]): void;

        news_categories_child(...args: any[]): void;

        news_categories_familytree(...args: any[]): void;

        news_categories_son(...args: any[]): void;

        news_categories_tag(...args: any[]): void;

        page_add(...args: any[]): void;

        page_get(...args: any[]): void;

        page_update(...args: any[]): void;

        pagesList(...args: any[]): void;

        recommend_user_all(...args: any[]): void;

        signout(...args: any[]): void;

        tag(...args: any[]): void;

        tag_list(...args: any[]): void;

        theme_list(...args: any[]): void;

        webinfo(...args: any[]): void;

        zhaopin_list(...args: any[]): void;

        zhaopin_list_server(...args: any[]): void;

    }
}
