module.exports = Self =>
{
    for (const Key of Object.getOwnPropertyNames(Self.constructor.prototype))
    {
        const Value = Self[Key];

        if (Key !== 'constructor' && typeof Value === 'function')
            Self[Key] = Value.bind(Self);
    }

    return Self;
};
