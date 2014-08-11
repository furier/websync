/**
 * Created by sander.struijk on 08.08.14.
 */
'use strict';

module.exports = function () {
    return {
        restrict: 'E',
        scope: {
            cronvalue: '='
        },
        replace: true,
        templateUrl: '../../views/partials/scheduler.html',
        link: function (scope, element, attrs) {

            var MINUTE = 0,
                HOUR = 1,
                DAY = 2,
                WEEK = 3,
                MONTH = 4,
                YEAR = 5;

            var daysInEachMonth = {
                1: 31,
                2: 28,
                3: 31,
                4: 30,
                5: 31,
                6: 30,
                7: 31,
                8: 31,
                9: 30,
                10: 31,
                11: 30,
                12: 31
            };

            scope.days = generateDaysOptions(1);
            scope.hours = generateRange(24);
            scope.minutes = generateRange(60);

            scope.selectedMonth = 0;
            scope.selectedWeekDay = 0;
            scope.selectedDay = 0;
            scope.selectedHour = 0;
            scope.selectedMinute = 0;

            if (scope.cronvalue) {
                parsecronvalue();
            } else {
                scope.selectedEvery = 0;
                scope.cronvalue = '* * * * *';
            }

            function generateDaysOptions(month) {
                var days = [];
                for (var i = 1; i <= daysInEachMonth[month]; i++) {
                    days.push(i);
                }
                return days;
            }

            function generateRange(count) {
                var list = [];
                for (var i = 0; i < count; i++) {
                    list.push(i);
                }
                return list;
            }

            function generatecronvalue(minute, hour, day, month, dayOfWeek) {
                switch (parseInt(scope.selectedEvery, 10)) {
                    case MINUTE:
                        return '* * * * *';
                    case HOUR:
                        return minute + ' * * * *';
                    case DAY:
                        return minute + ' ' + hour + ' * * *';
                    case WEEK:
                        return minute + ' ' + hour + ' * * ' + dayOfWeek;
                    case MONTH:
                        return minute + ' ' + hour + ' ' + day + ' * *';
                    case YEAR:
                        return minute + ' ' + hour + ' ' + day + ' ' + month + ' *';
                }
            }

            function parsecronvalue() {
                var v = scope.cronvalue.split(' ');
                if (v.length === 5) {

                    if (v[4] !== '*')
                        scope.selectedEvery = 3;
                    else if (v[3] !== '*')
                        scope.selectedEvery = 5;
                    else if (v[2] !== '*')
                        scope.selectedEvery = 4;
                    else if (v[1] !== '*')
                        scope.selectedEvery = 2;
                    else if (v[0] !== '*')
                        scope.selectedEvery = 1;
                    else
                        scope.selectedEvery = 0;

                    scope.selectedMinute = parseInt(v[0] !== '*' ? v[0] : 0, 10);
                    scope.selectedHour = parseInt(v[1] !== '*' ? v[1] : 0, 10);
                    scope.selectedDay = parseInt(v[2] !== '*' ? v[2] : 0, 10);
                    scope.selectedMonth = parseInt(v[3] !== '*' ? v[3] : 0, 10);
                    scope.selectedWeekDay = parseInt(v[4] !== '*' ? v[4] : 0, 10);

                } else
                    throw new Error('cronvalue was not provided in the correct format: ' + scope.cronvalue + ', correct format is: "* * * * *".\n' +
                                    'Take a look @ http://en.wikipedia.org/wiki/Cron for more information.');
            }

            function onChange() {
                scope.cronvalue = generatecronvalue(scope.selectedMinute, scope.selectedHour, scope.selectedDay, scope.selectedMonth, scope.selectedWeekDay);
            }

            scope.$watch('selectedEvery', function (n,o) {

                scope.hideMinute = true;
                scope.hideHourAndMinute = true;
                scope.hideDay = true;
                scope.hideMonthAndDay = true;
                scope.hideWeekDay = true;

                switch (parseInt(n, 10))
                {
                    case MINUTE:
                        break;
                    case HOUR:
                        scope.hideMinute = false;
                        break;
                    case DAY:
                        scope.hideHourAndMinute = false;
                        break;
                    case WEEK:
                        scope.hideHourAndMinute = false;
                        scope.hideWeekDay = false;
                        break;
                    case MONTH:
                        scope.hideHourAndMinute = false;
                        scope.hideDay = false;
                        break;
                    case YEAR:
                        scope.hideHourAndMinute = false;
                        scope.hideMonthAndDay = false;
                        break;
                }

            });

            scope.$watch('selectedMonth', function (n, o) {
                scope.days = generateDaysOptions(scope.selectedMonth+1);
            });

            scope.$watch('cronvalue', function (n, o) {
                if (scope.cronvalue)
                    parsecronvalue();
            });

            scope.$watch('selectedMinute', onChange);
            scope.$watch('selectedHour', onChange);
            scope.$watch('selectedDay', onChange);
            scope.$watch('selectedWeekDay', onChange);
            scope.$watch('selectedMonth', onChange);
            scope.$watch('selectedEvery', onChange);

        }
    };
};