export enum LANGUAGE {
    C = 1,
    PYTHON = 2,
    JAVASCRIPT = 3,
    MYSQL = 4,
}

export const LANGUAGE_MAP = {
    [LANGUAGE.C]: 'C',
    [LANGUAGE.PYTHON]: 'Python3',
    [LANGUAGE.JAVASCRIPT]: 'JavaScript',
    [LANGUAGE.MYSQL]: 'MySQL',
};

export enum PROBLEM_TYPE {
    STRUCTURE = 1,
    ALGORITHM = 2,
    DATABASE = 3,
}

export const PROBLEM_TYPE_MAP = {
    [PROBLEM_TYPE.STRUCTURE]: '数据结构',
    [PROBLEM_TYPE.ALGORITHM]: '算法',
    [PROBLEM_TYPE.DATABASE]: '数据库',
};

export enum PROBLEM_RANK {
    EASY = 1,
    MIDDLE = 2,
    DIFFCULT = 3,
}

export const PROBLEM_RANK_MAP = {
    [PROBLEM_RANK.EASY]: '简单',
    [PROBLEM_RANK.MIDDLE]: '中等',
    [PROBLEM_RANK.DIFFCULT]: '困难',
};

export enum PROBLEM_STATUS {
    PASS = 1,
    WRONG = 2,
    NONE = 0,
}

export const PROBLEM_STATUS_MAP = {
    [PROBLEM_STATUS.PASS]: '通过',
    [PROBLEM_STATUS.WRONG]: '出错',
    [PROBLEM_STATUS.NONE]: '未开始',
};