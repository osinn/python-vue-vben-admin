import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export namespace JobApi {
  export interface Job {
    [key: string]: any;
    /** 主键 */
    id: string;

    /** 任务组ID */
    job_group_id: string;

    /** 任务key唯一标识 */
    job_id: string;

    /** 触发器类型：1-date、2-interval、3-cron */
    trigger_type: number;

    /** 触发器触发条件 */
    trigger_condition: string;

    /** 备注 */
    remarks: string;

    /** 作者 */
    author: string;

    /** 报警邮件 */
    alarm_email: number;

    /** 执行器任务handler(调用函数名称) */
    executor_handler: string;

    /** 执行器任务参数 */
    executor_param: string;
    /** 任务调度状态，1-运行，2-暂停 */
    job_status: number;
    /** 下次执行时间 */
    next_run_time: string;
  }
  export interface JobPageParam {
    [key: string]: any;
    /** 搜索关键字：任务key唯一标识/备注/作者/调用函数名称/报警邮件 */
    search_key: string;
  }
}

/**
 * 任务调度列表查询
 */
async function getJobSchedulerList(data: JobApi.JobPageParam) {
  return requestClient.post<Array<JobApi.Job>>(
    '/job/job_scheduler/get_job_scheduler_list',
    data,
  );
}

/**
 * 暂停任务调度
 */
async function pauseJobScheduler(job_scheduler_id: string) {
  return requestClient.put(`/job/job_scheduler/${job_scheduler_id}/pause_job_scheduler`);
}

/**
 * 继续任务调度
 */
async function resumeJobScheduler(job_scheduler_id: string) {
  return requestClient.put(`/job/job_scheduler/${job_scheduler_id}/resume_job_scheduler`);
}

export {
  getJobSchedulerList,
  pauseJobScheduler,
  resumeJobScheduler
};
