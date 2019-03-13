---
title: "CronJobs"
---

A Cron Job creates Jobs on a time-based schedule. One CronJob object is like one line of a crontab (cron table) file. It runs a job periodically on a given schedule. The schedule of CronJob can be set, for example, `*/1 * * * *` means excute the job every 1 minute, the format of the timing plan please reference [CRON](https://en.wikipedia.org/wiki/Cron).

## Create a CronJob

Sign in with project-regular, enter into one project (e.g. demo-namespace), then select **Workload → CronJobs**.

![Create a CronJob](https://pek3b.qingstor.com/kubesphere-docs/png/20190312214834.png)

### Step 1: Fill in the Basic Information

1.1. Click **Create CronJob** button, then fill in the basic information in the pop-up window. There are two ways to create a CronJob, i.e. **fill in the creation table** and **edit mode**. The following mainly introduces each step of within creation table. If you prefer edit mode, you can click on the **edit mode**, it supports the yaml and json formats. Edit mode makes it easy for users who are used to command operations.

![Edit mode](https://pek3b.qingstor.com/kubesphere-docs/png/20190312214937.png)

1.2. On the basic information page, enter the name of the CronJob, you can also fill in the description as required.

- Name: A concise and clear name for this Job, which is convenient for users to browse and search.
- Alias: Helps you better distinguish resources and supports Chinese names.
- Schedule:  It runs a job periodically on a given time-based schedule, reference [CRON](https://en.wikipedia.org/wiki/Cron).
- Description: A brief introduction to this Job.

Click **Advanced Options** to set CronJob limitations, there are 4 fields as following:

- startingDeadlineSeconds: The controller counts how many missed jobs occurred from the value of startingDeadlineSeconds until now rather than from the last scheduled time until now. 
- successfulJobsHistoryLimit and failedJobsHistoryLimitz: Optional, these fields specify how many completed and failed jobs should be kept.
- concurrencyPolicy: Optional, it specifies how to treat concurrent executions of a job that is created by this cron job. the spec may specify only one of the following concurrency policies:
   - Allow (default): The cron job allows concurrently running jobs
   - Forbid: The cron job does not allow concurrent runs; if it is time for a new job run and the previous job run hasn’t finished yet, the cron job skips the new job run
   - Replace: If it is time for a new job run and the previous job run hasn’t finished yet, the cron job replaces the currently running job run with a new job run

Click **Next** when you're done.

![basic information](https://pek3b.qingstor.com/kubesphere-docs/png/20190312223540.png)

### Step 2: CronJob Settings

CronJob has specified following 4 kind of settings to handling pod lifecycle.

- BackoffLimit: Specify the number of retries before considering a Job as failed.
- Completions: Specify the desired number of successfully finished pods the job should be run with.
- Parallelism: Specify the maximum desired number of pods the job should run at any given time.
- Active Deadline Seconds: Apply to the duration of the job, no matter how many Pods are created. Once a Job reaches activeDeadlineSeconds, all of its Pods are terminated and the Job status will become type: Failed with reason: DeadlineExceeded.

![Job Settings](https://pek3b.qingstor.com/kubesphere-docs/png/20190312202506.png)  



