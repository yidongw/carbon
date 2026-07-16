"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItarLoginDisclaimer = ItarLoginDisclaimer;
exports.ItarDisclosure = ItarDisclosure;
exports.ItarPopup = ItarPopup;
var react_1 = require("react");
var react_router_1 = require("react-router");
var Button_1 = require("./Button");
var Modal_1 = require("./Modal");
var Toast_1 = require("./Toast");
/**
 *
export function AcademyBanner({
  acknowledgeAction
}: {
  acknowledgeAction: string;
}) {
  const fetcher = useFetcher<{}>();
  
  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 flex items-center justify-between gap-10  bg-[#212278] dark:bg-[#2f31ae] text-white py-1 px-2 rounded-lg z-50 shadow-md">
    <div />
    <fetcher.Form method="post" action={acknowledgeAction}>
    <input type="hidden" name="intent" value="academy" />
    <input
    type="hidden"
    name="redirectTo"
    value="https://learn.carbon.ms"
    />
    <Button
    type="submit"
    variant="ghost"
    size="lg"
    className="hover:bg-transparent text-white hover:text-white"
    rightIcon={<LuArrowUpRight />}
    >
    <span>Introducing Carbon Academy</span>
    </Button>
    </fetcher.Form>
    <fetcher.Form method="post" action={acknowledgeAction}>
    <input type="hidden" name="intent" value="academy" />
    <IconButton
    type="submit"
    aria-label="Close"
    variant="ghost"
    className="text-white dark:text-white hover:text-white"
    icon={<LuX />}
    />
    </fetcher.Form>
    </div>
  );
}
*/
function ItarLoginDisclaimer() {
    return (<p>
      <p>
        This is an ITAR-controlled solution. Access and use are restricted to
        U.S. Persons only
      </p>
    </p>);
}
function ItarDisclosure(_a) {
    var disclosure = _a.disclosure;
    return (<Modal_1.Modal open={disclosure.isOpen} onOpenChange={function (open) {
            if (!open)
                disclosure.onClose();
        }}>
      <Modal_1.ModalContent size="medium">
        <Modal_1.ModalHeader>
          <Modal_1.ModalTitle>ITAR-controlled solution</Modal_1.ModalTitle>
        </Modal_1.ModalHeader>
        <Modal_1.ModalBody>
          <p className="text-sm text-muted-foreground">
            This is an ITAR-controlled solution. Access and use are restricted
            to U.S. Persons only
          </p>
        </Modal_1.ModalBody>
        <Modal_1.ModalFooter>
          <Button_1.Button variant="secondary" onClick={disclosure.onClose}>
            Close
          </Button_1.Button>
        </Modal_1.ModalFooter>
      </Modal_1.ModalContent>
    </Modal_1.Modal>);
}
function ItarPopup(_a) {
    var acknowledgeAction = _a.acknowledgeAction, logoutAction = _a.logoutAction;
    var acknowledgeFetcher = (0, react_router_1.useFetcher)();
    var isLoading = acknowledgeFetcher.state !== "idle";
    (0, react_1.useEffect)(function () {
        var _a, _b, _c, _d;
        if (((_a = acknowledgeFetcher.data) === null || _a === void 0 ? void 0 : _a.success) === true) {
            Toast_1.toast.success((_b = acknowledgeFetcher.data) === null || _b === void 0 ? void 0 : _b.message);
        }
        else if (((_c = acknowledgeFetcher.data) === null || _c === void 0 ? void 0 : _c.success) === false) {
            Toast_1.toast.error((_d = acknowledgeFetcher.data) === null || _d === void 0 ? void 0 : _d.message);
        }
    }, [acknowledgeFetcher.data]);
    return (<Modal_1.Modal open>
      <Modal_1.ModalContent size="medium">
        <Modal_1.ModalHeader>
          <Modal_1.ModalTitle>ITAR-controlled solution</Modal_1.ModalTitle>
        </Modal_1.ModalHeader>
        <Modal_1.ModalBody>
          <p className="text-sm text-muted-foreground">
            This is an ITAR-controlled solution. Access and use are restricted
            to U.S. Persons only
          </p>
        </Modal_1.ModalBody>
        <Modal_1.ModalFooter>
          <acknowledgeFetcher.Form method="post" action={acknowledgeAction}>
            <input type="hidden" name="intent" value="itar"/>
            <Button_1.Button type="submit" isLoading={isLoading} isDisabled={isLoading}>
              I am a U.S. Person
            </Button_1.Button>
          </acknowledgeFetcher.Form>

          <react_router_1.Form method="post" action={logoutAction}>
            <Button_1.Button type="submit" variant="secondary" isDisabled={isLoading}>
              I am not a U.S. Person
            </Button_1.Button>
          </react_router_1.Form>
        </Modal_1.ModalFooter>
      </Modal_1.ModalContent>
    </Modal_1.Modal>);
}
