import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { ApiUrl } from '../constants/api_url';
import { normalizeString } from '../utils/helper';
import parseDuration from 'parse-duration';
import * as chrono from 'chrono-node';
import * as https from 'https';

@Injectable()
export class TimeSheetService {
  private apiClient: AxiosInstance;
  constructor(private readonly http: HttpService) {
    // Create a custom HTTPS agent to disable SSL certificate validation
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    });

    // Create an Axios instance with predefined configuration
    this.apiClient = axios.create({
      httpsAgent,
      headers: {
        'X-Secret-Key': process.env.WFH_API_KEY_SECRET,
        'Content-Type': 'application/json',
      },
    });
  }

  async findWFHUser() {
    const url = `${ApiUrl.WFHApi.api_url}?date=${new Date().toDateString()}`;
    const response = await this.apiClient.get(url);
    if (response.status == 200) {
      const wfhResult = await response.data;
      return wfhResult?.['result'] ? wfhResult['result'] : [];
    }

    return [];
  }

  parseDailyMessage = (message) => {
    const [, metaRaw, yesterday, todayRaw, block] = message.split(
      new RegExp('\\*daily|[- ]?yesterday:|[- ]?today:|[- ]?block:', 'ig'),
    );
    const [projectRaw, dateRaw] = metaRaw.trim().split(/\s+/);
    const dateStr = dateRaw
      ? normalizeString(dateRaw)
      : normalizeString(projectRaw);
    const projectCode = dateRaw ? normalizeString(projectRaw) : null;
    const todayStr = normalizeString(todayRaw);
    const date = chrono.parseDate(dateStr);
    const tasks = this.parseTimeSheetSentence(todayStr);
    const contentObj = {
      date: dateStr,
      projectCode,
      timeStamp: date,
      yesterday: normalizeString(yesterday),
      today: todayStr,
      block: normalizeString(block),
      tasks,
    };
    return contentObj;
  };

  logTimeSheetFromDaily = async ({ content, emailAddress }) => {
    const data = this.parseDailyMessage(content);
    const projectCode = data.projectCode;
    const results = [];
    for (const task of data.tasks) {
      try {
        const response = await this.logTimeSheetForTask({
          projectCode,
          task,
          emailAddress,
        });
        const result = response.data;
        results.push(result);
      } catch (e) {
        console.log(e);
        results.push({
          success: false,
          result:
            e.response && e.response.message ? e.response.message : e.message,
        });
      }
    }
  };

  logTimeSheetForTask = async ({ task, projectCode, emailAddress }) => {
    const typeOfWork = task.type === 'ot' ? 1 : 0;
    const hour = task.duration ? task.duration / 3600000 : 0;
    const taskName = task.name;
    const timesheetPayload = {
      note: task.note,
      emailAddress,
      projectCode,
      typeOfWork,
      taskName,
      hour,
    };
    const url =
      !hour || !projectCode
        ? `${process.env.TIMESHEET_API}MyTimesheets/CreateByKomu`
        : `${process.env.TIMESHEET_API}MyTimesheets/CreateFullByKomu`;
    console.log(url, timesheetPayload);
    const response = await this.apiClient.post(url, timesheetPayload);
    return response;
  };

  parseTimeSheetTask = (chunk) => {
    const [note, meta] = (chunk || '').split(';');
    const [timeRaw, type, name] = (meta || '').split(',');
    const time = normalizeString(timeRaw);
    const duration = parseDuration(time);
    const task = {
      note: normalizeString(note),
      time: time,
      duration: duration,
      type: normalizeString(type),
      name: normalizeString(name),
    };
    return task;
  };

  parseTimeSheetSentence = (sentence) => {
    const chunks = sentence.split(new RegExp('\\+', 'ig'));
    const items = chunks
      .filter((chunk) => chunk.trim())
      .map((chunk) => this.parseTimeSheetTask(chunk));
    return items;
  };
}
