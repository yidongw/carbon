"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var getInputProps_1 = require("./getInputProps");
var fakeEvent = { fake: "event" };
(0, vitest_1.describe)("getInputProps", function () {
    (0, vitest_1.describe)("initial", function () {
        (0, vitest_1.it)("should validate on blur by default", function () {
            var options = {
                name: "some-field",
                defaultValue: "test default value",
                touched: false,
                hasBeenSubmitted: false,
                setTouched: vitest_1.vi.fn(),
                clearError: vitest_1.vi.fn(),
                validate: vitest_1.vi.fn()
            };
            var getInputProps = (0, getInputProps_1.createGetInputProps)(options);
            var provided = {
                onBlur: vitest_1.vi.fn(),
                onChange: vitest_1.vi.fn()
            };
            var _a = getInputProps(provided), onChange = _a.onChange, onBlur = _a.onBlur;
            onChange(fakeEvent);
            (0, vitest_1.expect)(provided.onChange).toBeCalledTimes(1);
            (0, vitest_1.expect)(provided.onChange).toBeCalledWith(fakeEvent);
            (0, vitest_1.expect)(options.setTouched).toBeCalledTimes(1);
            (0, vitest_1.expect)(options.setTouched).toBeCalledWith(true);
            (0, vitest_1.expect)(options.validate).not.toBeCalled();
            onBlur(fakeEvent);
            (0, vitest_1.expect)(provided.onBlur).toBeCalledTimes(1);
            (0, vitest_1.expect)(provided.onBlur).toBeCalledWith(fakeEvent);
            (0, vitest_1.expect)(options.setTouched).toBeCalledTimes(1);
            (0, vitest_1.expect)(options.validate).toBeCalledTimes(1);
        });
        (0, vitest_1.it)("should respect provided validation behavior", function () {
            var options = {
                name: "some-field",
                defaultValue: "test default value",
                touched: false,
                hasBeenSubmitted: false,
                setTouched: vitest_1.vi.fn(),
                clearError: vitest_1.vi.fn(),
                validate: vitest_1.vi.fn(),
                validationBehavior: {
                    initial: "onChange"
                }
            };
            var getInputProps = (0, getInputProps_1.createGetInputProps)(options);
            var provided = {
                onBlur: vitest_1.vi.fn(),
                onChange: vitest_1.vi.fn()
            };
            var _a = getInputProps(provided), onChange = _a.onChange, onBlur = _a.onBlur;
            onChange(fakeEvent);
            (0, vitest_1.expect)(provided.onChange).toBeCalledTimes(1);
            (0, vitest_1.expect)(provided.onChange).toBeCalledWith(fakeEvent);
            (0, vitest_1.expect)(options.setTouched).toBeCalledTimes(1);
            (0, vitest_1.expect)(options.setTouched).toBeCalledWith(true);
            (0, vitest_1.expect)(options.validate).toBeCalledTimes(1);
            onBlur(fakeEvent);
            (0, vitest_1.expect)(provided.onBlur).toBeCalledTimes(1);
            (0, vitest_1.expect)(provided.onBlur).toBeCalledWith(fakeEvent);
            (0, vitest_1.expect)(options.setTouched).toBeCalledTimes(1);
            (0, vitest_1.expect)(options.validate).toBeCalledTimes(1);
        });
        (0, vitest_1.it)("should not validate when behavior is onSubmit", function () {
            var options = {
                name: "some-field",
                defaultValue: "test default value",
                touched: false,
                hasBeenSubmitted: false,
                setTouched: vitest_1.vi.fn(),
                clearError: vitest_1.vi.fn(),
                validate: vitest_1.vi.fn(),
                validationBehavior: {
                    initial: "onSubmit"
                }
            };
            var getInputProps = (0, getInputProps_1.createGetInputProps)(options);
            var provided = {
                onBlur: vitest_1.vi.fn(),
                onChange: vitest_1.vi.fn()
            };
            var _a = getInputProps(provided), onChange = _a.onChange, onBlur = _a.onBlur;
            onChange(fakeEvent);
            (0, vitest_1.expect)(provided.onChange).toBeCalledTimes(1);
            (0, vitest_1.expect)(provided.onChange).toBeCalledWith(fakeEvent);
            (0, vitest_1.expect)(options.setTouched).toBeCalledTimes(1);
            (0, vitest_1.expect)(options.setTouched).toBeCalledWith(true);
            (0, vitest_1.expect)(options.validate).not.toBeCalled();
            onBlur(fakeEvent);
            (0, vitest_1.expect)(provided.onBlur).toBeCalledTimes(1);
            (0, vitest_1.expect)(provided.onBlur).toBeCalledWith(fakeEvent);
            (0, vitest_1.expect)(options.setTouched).toBeCalledTimes(1);
            (0, vitest_1.expect)(options.validate).not.toBeCalled();
        });
    });
    (0, vitest_1.describe)("whenTouched", function () {
        (0, vitest_1.it)("should validate on change by default", function () {
            var options = {
                name: "some-field",
                defaultValue: "test default value",
                touched: true,
                hasBeenSubmitted: false,
                setTouched: vitest_1.vi.fn(),
                clearError: vitest_1.vi.fn(),
                validate: vitest_1.vi.fn()
            };
            var getInputProps = (0, getInputProps_1.createGetInputProps)(options);
            var provided = {
                onBlur: vitest_1.vi.fn(),
                onChange: vitest_1.vi.fn()
            };
            var _a = getInputProps(provided), onChange = _a.onChange, onBlur = _a.onBlur;
            onChange(fakeEvent);
            (0, vitest_1.expect)(provided.onChange).toBeCalledTimes(1);
            (0, vitest_1.expect)(provided.onChange).toBeCalledWith(fakeEvent);
            (0, vitest_1.expect)(options.setTouched).toBeCalledTimes(1);
            (0, vitest_1.expect)(options.setTouched).toBeCalledWith(true);
            (0, vitest_1.expect)(options.validate).toBeCalledTimes(1);
            onBlur(fakeEvent);
            (0, vitest_1.expect)(provided.onBlur).toBeCalledTimes(1);
            (0, vitest_1.expect)(provided.onBlur).toBeCalledWith(fakeEvent);
            (0, vitest_1.expect)(options.setTouched).toBeCalledTimes(1);
            (0, vitest_1.expect)(options.validate).toBeCalledTimes(1);
        });
        (0, vitest_1.it)("should respect provided validation behavior", function () {
            var options = {
                name: "some-field",
                defaultValue: "test default value",
                touched: true,
                hasBeenSubmitted: false,
                setTouched: vitest_1.vi.fn(),
                clearError: vitest_1.vi.fn(),
                validate: vitest_1.vi.fn(),
                validationBehavior: {
                    whenTouched: "onBlur"
                }
            };
            var getInputProps = (0, getInputProps_1.createGetInputProps)(options);
            var provided = {
                onBlur: vitest_1.vi.fn(),
                onChange: vitest_1.vi.fn()
            };
            var _a = getInputProps(provided), onChange = _a.onChange, onBlur = _a.onBlur;
            onChange(fakeEvent);
            (0, vitest_1.expect)(provided.onChange).toBeCalledTimes(1);
            (0, vitest_1.expect)(provided.onChange).toBeCalledWith(fakeEvent);
            (0, vitest_1.expect)(options.setTouched).toBeCalledTimes(1);
            (0, vitest_1.expect)(options.setTouched).toBeCalledWith(true);
            (0, vitest_1.expect)(options.validate).not.toBeCalled();
            onBlur(fakeEvent);
            (0, vitest_1.expect)(provided.onBlur).toBeCalledTimes(1);
            (0, vitest_1.expect)(provided.onBlur).toBeCalledWith(fakeEvent);
            (0, vitest_1.expect)(options.setTouched).toBeCalledTimes(1);
            (0, vitest_1.expect)(options.validate).toBeCalledTimes(1);
        });
    });
    (0, vitest_1.describe)("whenSubmitted", function () {
        (0, vitest_1.it)("should validate on change by default", function () {
            var options = {
                name: "some-field",
                defaultValue: "test default value",
                touched: true,
                hasBeenSubmitted: true,
                setTouched: vitest_1.vi.fn(),
                clearError: vitest_1.vi.fn(),
                validate: vitest_1.vi.fn()
            };
            var getInputProps = (0, getInputProps_1.createGetInputProps)(options);
            var provided = {
                onBlur: vitest_1.vi.fn(),
                onChange: vitest_1.vi.fn()
            };
            var _a = getInputProps(provided), onChange = _a.onChange, onBlur = _a.onBlur;
            onChange(fakeEvent);
            (0, vitest_1.expect)(provided.onChange).toBeCalledTimes(1);
            (0, vitest_1.expect)(provided.onChange).toBeCalledWith(fakeEvent);
            (0, vitest_1.expect)(options.setTouched).toBeCalledTimes(1);
            (0, vitest_1.expect)(options.setTouched).toBeCalledWith(true);
            (0, vitest_1.expect)(options.validate).toBeCalledTimes(1);
            onBlur(fakeEvent);
            (0, vitest_1.expect)(provided.onBlur).toBeCalledTimes(1);
            (0, vitest_1.expect)(provided.onBlur).toBeCalledWith(fakeEvent);
            (0, vitest_1.expect)(options.setTouched).toBeCalledTimes(1);
            (0, vitest_1.expect)(options.validate).toBeCalledTimes(1);
        });
        (0, vitest_1.it)("should respect provided validation behavior", function () {
            var options = {
                name: "some-field",
                defaultValue: "test default value",
                touched: true,
                hasBeenSubmitted: true,
                setTouched: vitest_1.vi.fn(),
                clearError: vitest_1.vi.fn(),
                validate: vitest_1.vi.fn(),
                validationBehavior: {
                    whenSubmitted: "onBlur"
                }
            };
            var getInputProps = (0, getInputProps_1.createGetInputProps)(options);
            var provided = {
                onBlur: vitest_1.vi.fn(),
                onChange: vitest_1.vi.fn()
            };
            var _a = getInputProps(provided), onChange = _a.onChange, onBlur = _a.onBlur;
            onChange(fakeEvent);
            (0, vitest_1.expect)(provided.onChange).toBeCalledTimes(1);
            (0, vitest_1.expect)(provided.onChange).toBeCalledWith(fakeEvent);
            (0, vitest_1.expect)(options.setTouched).toBeCalledTimes(1);
            (0, vitest_1.expect)(options.setTouched).toBeCalledWith(true);
            (0, vitest_1.expect)(options.validate).not.toBeCalled();
            onBlur(fakeEvent);
            (0, vitest_1.expect)(provided.onBlur).toBeCalledTimes(1);
            (0, vitest_1.expect)(provided.onBlur).toBeCalledWith(fakeEvent);
            (0, vitest_1.expect)(options.setTouched).toBeCalledTimes(1);
            (0, vitest_1.expect)(options.validate).toBeCalledTimes(1);
        });
    });
});
