
import type { Database } from 'better-sqlite3';
interface db_base extends Database {
    tables:{
        [key:string]:table
    }
}

interface akshare_db extends Database {
    tables: {
        stock_info_a_code_name:table
        sqlite_sequence:table
        hist_lastday:table
        hist_daily:table
    }
}
                        
interface default_db extends Database {
    tables: {
        sqlite_sequence:table
        realname_auth:table
        session:table
        _uni_id_users_old_20230831:table
        signin_records:table
        webinfo:table
        zhaopin:table
        banner:table
        bill:table
        clientssay:table
        contact:table
        cropper:table
        files:table
        friendlink:table
        image:table
        message:table
        _news_articles_old_20241221:table
        pages:table
        tag:table
        tag_relationship:table
        _domain_old_20230805:table
        news_categories:table
        _theme_old_20240207:table
        domain:table
        uni_id_users:table
        theme:table
        news_articles:table
    }
}
                        
interface douyin_db extends Database {
    tables: {
        _douyin_old_20250321:table
        _douyin_old_20250321_1:table
        sqlite_sequence:table
        douyin:table
        _douyin1_old_20250325:table
        douyin1:table
        _douyin2_old_20250326:table
        _douyin2_old_20250326_1:table
        _douyin2_old_20250326_2:table
        douyin2:table
    }
}
                        
interface test_db extends Database {
    tables: {
        _users_old_20241022:table
        _users_old_20250322:table
        users:table
    }
}
                        
interface fetSqlite extends Database {
    /*** 数据库名字或者better-sqlite3配置项options ***/
    DB: {
        (dbname?: string | { [key: string]: any }): db_base;
        akshare:akshare_db
        default:default_db
        douyin:douyin_db
        test:test_db
    // 动态添加属性
    };
    dbEntry: { [key: string]: fetSqlite };
    tables: {
                sqlite_sequence:table
                realname_auth:table
                session:table
                _uni_id_users_old_20230831:table
                signin_records:table
                webinfo:table
                zhaopin:table
                banner:table
                bill:table
                clientssay:table
                contact:table
                cropper:table
                files:table
                friendlink:table
                image:table
                message:table
                _news_articles_old_20241221:table
                pages:table
                tag:table
                tag_relationship:table
                _domain_old_20230805:table
                news_categories:table
                _theme_old_20240207:table
                domain:table
                uni_id_users:table
                theme:table
                news_articles:table
                };
    [key: string]: fetSqlite;
}
export = fetSqlite;
            