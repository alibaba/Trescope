from trescope.controller import ControllerNode


class TriggerControl(ControllerNode):
    def toDict(self):
        return {**super().toDict(), 'type': 'TriggerControl'}
