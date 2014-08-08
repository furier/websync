/**
 * Created by sander.struijk on 08.08.14.
 */
'use strict';

var CronJob = require('cron').CronJob,
    _ = require('lodash');

var rsyncRunner = require('./rsyncrunner');

function CronTask(task, io) {

    var cronJob = new CronJob({
        cronTime: task.schedule.time,
        onTick: function () {
            var rsyncTasks = rsyncRunner.buildRsyncObjects(task);
            _.forEach(rsyncTasks, function (rsyncTask) {
                rsyncRunner.executeRsyncTask(rsyncTask, task.id, io)
            });
        },
        start: task.schedule.enabled
    });
    console.log('Created crontask.id: ' + task.id + ' with crontask.time: ' + task.schedule.time + ' crontask.enabled: ' + task.schedule.enabled);

    return {
        id: task.id,
        enable: function () {
            cronJob.start();
            console.log('crontask.id: ' + task.id + ' enabled.');
        },
        disable: function () {
            cronJob.stop();
            console.log('crontask.id: ' + task.id + ' disabled.');
        }
    };
}

module.exports = {
    jobs: [],
    initialize: function (tasks, io) {
        var jobs = [];
        _.forEach(tasks, function (task) {
            jobs.push(new CronTask(task, io));
        });
        this.jobs = jobs;
        console.log('Initialized (' + jobs.length + ') crontasks.');
    },
    createCronTask: function (task, io) {
        var cronTask = _.find(this.jobs, function (job) {
            try {
                return job.id === id;
            } catch (e){}
        });
        if (cronTask){
            console.error('Could not create crontask, crontask.id: ' + task.id + ' already existed.');
            return;
        }
        this.jobs.push(new CronTask(task, io));
        console.log('Added crontask.id: ' + task.id);
    },
    deleteCronTask: function (id) {
        var cronTask = _.chain(this.jobs).remove(function (job) {
            return job.id === id;
        }).first().value();
        if (!cronTask)
            console.error('Could not remove crontask, crontask.id: ' + id + ' did not exist.');
        else {
            cronTask.disable();
            console.log('Removed crontask.id: ' + cronTask.id);
            cronTask = null;
        }
    },
    enableCronTask: function (id) {
        var cronTask = _.find(this.jobs, function (job) {
            return job.id === id;
        });
        if (cronTask) {
            cronTask.enable();
        }
    },
    disableCronTask: function (id) {
        var cronTask = _.find(this.jobs, function (job) {
            return job.id === id;
        });
        if (cronTask) {
            cronTask.disable();
        }
    }
};