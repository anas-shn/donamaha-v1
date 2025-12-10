<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CampaignResource\Pages;
use App\Models\Campaign;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class CampaignResource extends Resource
{
    protected static ?string $model = Campaign::class;

    protected static ?string $navigationIcon = 'heroicon-o-megaphone';

    protected static ?string $navigationLabel = 'Campaigns';

    protected static ?string $modelLabel = 'Campaign';

    protected static ?string $pluralModelLabel = 'Campaigns';

    protected static ?int $navigationSort = 2;

    protected static ?string $navigationGroup = 'Campaign Management';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Campaign Information')
                    ->schema([
                        Forms\Components\Select::make('organizer_id')
                            ->label('Organizer')
                            ->relationship('organizer', 'name')
                            ->searchable()
                            ->preload()
                            ->required()
                            ->createOptionForm([
                                Forms\Components\TextInput::make('name')
                                    ->required()
                                    ->maxLength(150),
                                Forms\Components\TextInput::make('email')
                                    ->email()
                                    ->required()
                                    ->maxLength(150),
                                Forms\Components\TextInput::make('password')
                                    ->password()
                                    ->required()
                                    ->maxLength(255),
                                Forms\Components\Select::make('role')
                                    ->options([
                                        'organizer' => 'Organizer',
                                        'admin' => 'Admin',
                                    ])
                                    ->default('organizer')
                                    ->required(),
                            ])
                            ->columnSpanFull(),
                        Forms\Components\TextInput::make('title')
                            ->required()
                            ->maxLength(255)
                            ->label('Campaign Title')
                            ->placeholder('Enter campaign title')
                            ->columnSpanFull(),
                        Forms\Components\RichEditor::make('full_description')
                            ->required()
                            ->label('Full Description')
                            ->placeholder('Enter detailed campaign description')
                            ->columnSpanFull(),
                        Forms\Components\FileUpload::make('image_path')
                            ->image()
                            ->directory('campaigns')
                            ->maxSize(5120)
                            ->label('Campaign Image')
                            ->imageEditor()
                            ->columnSpanFull(),
                    ])
                    ->columns(1),

                Forms\Components\Section::make('Financial Details')
                    ->schema([
                        Forms\Components\TextInput::make('target_amount')
                            ->required()
                            ->numeric()
                            ->prefix('Rp')
                            ->minValue(0)
                            ->label('Target Amount')
                            ->placeholder('0'),
                        Forms\Components\TextInput::make('collected_amount')
                            ->required()
                            ->numeric()
                            ->prefix('Rp')
                            ->default(0)
                            ->minValue(0)
                            ->label('Collected Amount')
                            ->placeholder('0')
                            ->disabled(fn (string $operation): bool => $operation === 'create'),
                    ])
                    ->columns(2),

                Forms\Components\Section::make('Campaign Status & Timeline')
                    ->schema([
                        Forms\Components\Select::make('status')
                            ->required()
                            ->options([
                                'draft' => 'Draft',
                                'active' => 'Active',
                                'completed' => 'Completed',
                                'cancelled' => 'Cancelled',
                            ])
                            ->default('draft')
                            ->label('Status'),
                        Forms\Components\DatePicker::make('start_date')
                            ->required()
                            ->label('Start Date')
                            ->native(false)
                            ->displayFormat('d/m/Y')
                            ->default(now()),
                        Forms\Components\DatePicker::make('end_date')
                            ->required()
                            ->label('End Date')
                            ->native(false)
                            ->displayFormat('d/m/Y')
                            ->after('start_date'),
                    ])
                    ->columns(3),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('image_path')
                    ->label('Image')
                    ->circular()
                    ->defaultImageUrl(url('/images/default-campaign.png')),
                Tables\Columns\TextColumn::make('title')
                    ->searchable()
                    ->sortable()
                    ->limit(50)
                    ->label('Title')
                    ->wrap(),
                Tables\Columns\TextColumn::make('organizer.name')
                    ->searchable()
                    ->sortable()
                    ->label('Organizer'),
                Tables\Columns\TextColumn::make('target_amount')
                    ->numeric()
                    ->sortable()
                    ->money('IDR')
                    ->label('Target'),
                Tables\Columns\TextColumn::make('collected_amount')
                    ->numeric()
                    ->sortable()
                    ->money('IDR')
                    ->label('Collected'),
                Tables\Columns\TextColumn::make('progress')
                    ->label('Progress')
                    ->state(function (Campaign $record): string {
                        if ($record->target_amount > 0) {
                            $percentage = ($record->collected_amount / $record->target_amount) * 100;

                            return number_format(min($percentage, 100), 1).'%';
                        }

                        return '0%';
                    })
                    ->sortable(query: function (Builder $query, string $direction): Builder {
                        return $query->orderByRaw('(collected_amount / target_amount) '.$direction);
                    }),
                Tables\Columns\BadgeColumn::make('status')
                    ->searchable()
                    ->sortable()
                    ->colors([
                        'secondary' => 'draft',
                        'success' => 'active',
                        'primary' => 'completed',
                        'danger' => 'cancelled',
                    ])
                    ->label('Status'),
                Tables\Columns\TextColumn::make('donations_count')
                    ->counts('donations')
                    ->label('Donations')
                    ->sortable(),
                Tables\Columns\TextColumn::make('start_date')
                    ->date('d M Y')
                    ->sortable()
                    ->label('Start Date')
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('end_date')
                    ->date('d M Y')
                    ->sortable()
                    ->label('End Date'),
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
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'draft' => 'Draft',
                        'active' => 'Active',
                        'completed' => 'Completed',
                        'cancelled' => 'Cancelled',
                    ])
                    ->label('Filter by Status'),
                Tables\Filters\SelectFilter::make('organizer')
                    ->relationship('organizer', 'name')
                    ->searchable()
                    ->preload()
                    ->label('Filter by Organizer'),
                Tables\Filters\Filter::make('date_range')
                    ->form([
                        Forms\Components\DatePicker::make('start_from')
                            ->label('Start From')
                            ->native(false),
                        Forms\Components\DatePicker::make('end_until')
                            ->label('End Until')
                            ->native(false),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when(
                                $data['start_from'],
                                fn (Builder $query, $date): Builder => $query->whereDate('start_date', '>=', $date),
                            )
                            ->when(
                                $data['end_until'],
                                fn (Builder $query, $date): Builder => $query->whereDate('end_date', '<=', $date),
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
            'index' => Pages\ListCampaigns::route('/'),
            'create' => Pages\CreateCampaign::route('/create'),
            'edit' => Pages\EditCampaign::route('/{record}/edit'),
        ];
    }
}
