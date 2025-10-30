class ZeroInputError(Exception):
    def __init__(self, message='Данные не были введены'):
        self.message = message
        super().__init__(self.message)
    
    def check_values(self, args=list()):
        for n, i in enumerate(args):
            if type(i) == None:
                raise(ZeroInputError)
            if i == 0:
                print('Не было выбрано значение для:', self.get_unchecked_value(n))
                raise(ZeroInputError)
    
    def get_unchecked_value(self, index):
        args = ['buildings', 'day', 'week', 'time']
        
        return args[index]