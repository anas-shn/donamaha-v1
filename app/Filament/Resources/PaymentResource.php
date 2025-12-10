<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PaymentResource\Pages;
use App\Models\Donation;
use App\Models\Payment;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class PaymentResource extends Resource
{
    protected static ?string $model = Payment::class;

    protected static ?string $navigationIcon = 'heroicon-o-credit-card';

    protected static ?string $navigationLabel = 'Payments';

    protected static ?string $modelLabel = 'Payment';

    protected static ?string $pluralModelLabel = 'Payments';

    protected static ?int $navigationSort = 3;

    protected static ?string $navigationGroup = 'Financial';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Payment Information')
                    ->schema([
                        Forms\Components\Select::make('donation_id')
                            ->label('Donation')
                            ->relationship('donation', 'id')
                            ->searchable()
                            ->preload()
                            ->required()
                            ->getOptionLabelFromRecordUsing(fn (Donation $record) => "Donation #{$record->id} - ".$record->donor_name)
                            ->columnSpanFull(),
                        Forms\Components\Select::make('payment_method')
                            ->required()
                            ->options([
                                'bank_transfer' => 'Bank Transfer',
                                'e_wallet' => 'E-Wallet',
                                'credit_card' => 'Credit Card',
                                'qris' => 'QRIS',
                                'cash' => 'Cash',
                            ])
                            ->label('Payment Method')
                            ->native(false),
                        Forms\Components\Select::make('payment_status')
                            ->required()
                            ->options([
                                'pending' => 'Pending',
                                'processing' => 'Processing',
                                'completed' => 'Completed',
                                'failed' => 'Failed',
                                'cancelled' => 'Cancelled',
                                'refunded' => 'Refunded',
                            ])
                            ->default('pending')
                            ->label('Payment Status')
                            ->native(false),
                        Forms\Components\DateTimePicker::make('paid_at')
                            ->label('Paid At')
                            ->native(false)
                            ->displayFormat('d/m/Y H:i')
                            ->seconds(false),
                    ])
                    ->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id')
                    ->label('Payment ID')
                    ->sortable()
                    ->searchable(),
                Tables\Columns\TextColumn::make('donation.id')
                    ->label('Donation ID')
                    ->sortable()
                    ->searchable()
                    ->url(fn (Payment $record): string => $record->donation ? route('filament.admin.resources.donations.view', $record->donation) : '#'),
                Tables\Columns\TextColumn::make('donation.donor_name')
                    ->label('Donor Name')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('donation.amount')
                    ->label('Amount')
                    ->money('IDR')
                    ->sortable(),
                Tables\Columns\TextColumn::make('payment_method')
                    ->searchable()
                    ->sortable()
                    ->badge()
                    ->colors([
                        'primary' => 'bank_transfer',
                        'success' => 'e_wallet',
                        'warning' => 'credit_card',
                        'info' => 'qris',
                        'secondary' => 'cash',
                    ])
                    ->formatStateUsing(fn (string $state): string => str_replace('_', ' ', ucwords($state, '_')))
                    ->label('Payment Method'),
                Tables\Columns\BadgeColumn::make('payment_status')
                    ->searchable()
                    ->sortable()
                    ->colors([
                        'warning' => 'pending',
                        'info' => 'processing',
                        'success' => 'completed',
                        'danger' => 'failed',
                        'secondary' => 'cancelled',
                        'primary' => 'refunded',
                    ])
                    ->label('Status'),
                Tables\Columns\TextColumn::make('paid_at')
                    ->dateTime('d M Y, H:i')
                    ->sortable()
                    ->label('Paid At')
                    ->placeholder('Not paid yet'),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime('d M Y, H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true)
                    ->label('Created At'),
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime('d M Y, H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true)
                    ->label('Updated At'),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('payment_method')
                    ->options([
                        'bank_transfer' => 'Bank Transfer',
                        'e_wallet' => 'E-Wallet',
                        'credit_card' => 'Credit Card',
                        'qris' => 'QRIS',
                        'cash' => 'Cash',
                    ])
                    ->label('Filter by Method'),
                Tables\Filters\SelectFilter::make('payment_status')
                    ->options([
                        'pending' => 'Pending',
                        'processing' => 'Processing',
                        'completed' => 'Completed',
                        'failed' => 'Failed',
                        'cancelled' => 'Cancelled',
                        'refunded' => 'Refunded',
                    ])
                    ->label('Filter by Status'),
                Tables\Filters\Filter::make('paid_date')
                    ->form([
                        Forms\Components\DatePicker::make('paid_from')
                            ->label('Paid From')
                            ->native(false),
                        Forms\Components\DatePicker::make('paid_until')
                            ->label('Paid Until')
                            ->native(false),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when(
                                $data['paid_from'],
                                fn (Builder $query, $date): Builder => $query->whereDate('paid_at', '>=', $date),
                            )
                            ->when(
                                $data['paid_until'],
                                fn (Builder $query, $date): Builder => $query->whereDate('paid_at', '<=', $date),
                            );
                    }),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPayments::route('/'),
            'create' => Pages\CreatePayment::route('/create'),
            'edit' => Pages\EditPayment::route('/{record}/edit'),
        ];
    }
}
